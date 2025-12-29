<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatHistory;
use App\Services\RagService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    protected RagService $ragService;

    public function __construct(RagService $ragService)
    {
        $this->ragService = $ragService;
    }

    /**
     * Send message to chatbot with streaming support
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string|max:255',
            'stream' => 'nullable|boolean',
        ]);

        // Validate and sanitize session_id
        $sessionId = $validated['session_id'] ?? null;
        
        // If no session_id or invalid format, create new one
        if (!$sessionId || !preg_match('/^session_\d+_[a-z0-9]+_\d+$/', $sessionId)) {
            $sessionId = 'session_' . time() . '_' . Str::random(12) . '_' . abs(crc32($request->ip() . $request->userAgent()));
        }
        
        $userMessage = $validated['message'];
        $useStreaming = $validated['stream'] ?? true;

        // Clean old sessions (older than 24 hours) to prevent database bloat
        // Run this occasionally, not on every request
        if (rand(1, 100) === 1) {
            ChatHistory::where('created_at', '<', now()->subHours(24))->delete();
        }

        // Save user message to history
        $userChatHistory = ChatHistory::create([
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'sender' => 'user',
            'message' => $userMessage,
            'metadata' => null,
            'is_rag_enhanced' => false,
        ]);

        // Get recent conversation history for context (excluding current message)
        $conversationHistory = ChatHistory::where('session_id', $sessionId)
            ->where('id', '!=', $userChatHistory->id) // Exclude the message we just created
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->reverse()
            ->map(fn($chat) => [
                'sender' => $chat->sender,
                'message' => $chat->message,
            ])
            ->toArray();

        if ($useStreaming) {
            return $this->streamResponse($sessionId, $userMessage, $conversationHistory, $request);
        } else {
            return $this->normalResponse($sessionId, $userMessage, $conversationHistory, $request);
        }
    }

    /**
     * Stream response using Server-Sent Events
     */
    protected function streamResponse(string $sessionId, string $userMessage, array $conversationHistory, Request $request)
    {
        return response()->stream(function () use ($sessionId, $userMessage, $conversationHistory, $request) {
            // Generate RAG response (conversation history already excludes current user message)
            $ragResponse = $this->ragService->generateRagResponse(
                $userMessage,
                $conversationHistory
            );

            $fullMessage = $ragResponse['message'];
            $isRagEnhanced = $ragResponse['is_rag_enhanced'];

            // Send metadata first
            echo "data: " . json_encode([
                'type' => 'metadata',
                'session_id' => $sessionId,
                'is_rag_enhanced' => $isRagEnhanced,
            ]) . "\n\n";
            ob_flush();
            flush();

            // Stream message word by word
            $words = preg_split('/(\s+)/', $fullMessage, -1, PREG_SPLIT_DELIM_CAPTURE);
            $buffer = '';
            
            foreach ($words as $word) {
                $buffer .= $word;
                
                echo "data: " . json_encode([
                    'type' => 'content',
                    'content' => $word,
                ]) . "\n\n";
                
                ob_flush();
                flush();
                
                usleep(30000); // 30ms delay between words for smooth streaming
            }

            // Send completion event
            echo "data: " . json_encode([
                'type' => 'done',
                'full_message' => $fullMessage,
            ]) . "\n\n";
            ob_flush();
            flush();

            // Save bot response to history
            ChatHistory::create([
                'session_id' => $sessionId,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'sender' => 'bot',
                'message' => $fullMessage,
                'metadata' => [
                    'model' => \App\Models\AiSetting::get('ai_model_name'),
                    'chunks_used' => count($ragResponse['context_chunks'] ?? []),
                ],
                'is_rag_enhanced' => $isRagEnhanced,
                'retrieved_documents' => $ragResponse['retrieved_documents'] ?? null,
            ]);
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable nginx buffering
            'Access-Control-Allow-Origin' => '*', // Allow CORS for streaming
        ]);
    }

    /**
     * Normal non-streaming response (fallback)
     */
    protected function normalResponse(string $sessionId, string $userMessage, array $conversationHistory, Request $request)
    {
        // Generate RAG response (conversation history already excludes current user message)
        $ragResponse = $this->ragService->generateRagResponse(
            $userMessage,
            $conversationHistory
        );

        // Save bot response to history
        $botChat = ChatHistory::create([
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'sender' => 'bot',
            'message' => $ragResponse['message'],
            'metadata' => [
                'model' => \App\Models\AiSetting::get('ai_model_name'),
                'chunks_used' => count($ragResponse['context_chunks'] ?? []),
            ],
            'is_rag_enhanced' => $ragResponse['is_rag_enhanced'],
            'retrieved_documents' => $ragResponse['retrieved_documents'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
            'message' => $ragResponse['message'],
            'is_rag_enhanced' => $ragResponse['is_rag_enhanced'],
            'timestamp' => $botChat->created_at->toIso8601String(),
        ]);
    }

    /**
     * Get chat history for a session
     */
    public function getHistory(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|string',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $history = ChatHistory::where('session_id', $validated['session_id'])
            ->orderBy('created_at', 'asc')
            ->limit($validated['limit'] ?? 50)
            ->get()
            ->map(fn($chat) => [
                'id' => $chat->id,
                'sender' => $chat->sender,
                'message' => $chat->message,
                'is_rag_enhanced' => $chat->is_rag_enhanced,
                'timestamp' => $chat->created_at->toIso8601String(),
            ]);

        return response()->json([
            'success' => true,
            'history' => $history,
        ]);
    }
}
