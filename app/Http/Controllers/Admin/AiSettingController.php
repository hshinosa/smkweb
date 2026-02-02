<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AiSettingController extends Controller
{
    public function index()
    {
        $settings = AiSetting::all()->groupBy('key')->map(fn($group) => $group->first());

        return Inertia::render('Admin/AiSettings/Index', [
            'settings' => $settings->values(),
        ]);
    }

    /**
     * Get available models
     * Fetches from both OpenAI API and Ollama API directly
     */
    public function models()
    {
        $models = [];

        // Get models from OpenAI API (if configured)
        $baseUrl = AiSetting::get('ai_model_base_url', '');
        $apiKey = AiSetting::get('ai_model_api_key', '');

        if (!empty($baseUrl) && !empty($apiKey)) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(10)->get("{$baseUrl}/models");

                if ($response->successful()) {
                    $data = $response->json();
                    $models = array_merge($models, $data['data'] ?? []);
                }
            } catch (\Exception $e) {
                // OpenAI not available, skip
            }
        }

        // Get models from Ollama API (if configured)
        $ollamaBaseUrl = AiSetting::get('ollama_base_url', '');

        if (!empty($ollamaBaseUrl)) {
            try {
                $response = Http::timeout(10)->get("{$ollamaBaseUrl}/api/tags");

                if ($response->successful()) {
                    $data = $response->json();
                    $ollamaModels = $data['models'] ?? [];

                    // Format Ollama models to match OpenAI format
                    foreach ($ollamaModels as $model) {
                        $models[] = [
                            'id' => $model['name'],
                            'object' => 'model',
                            'created' => isset($model['modified_at']) ? strtotime($model['modified_at']) : time(),
                            'owned_by' => 'ollama',
                        ];
                    }
                }
            } catch (\Exception $e) {
                // Ollama not available, skip
            }
        }

        return response()->json([
            'success' => true,
            'models' => $models,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            $existingSetting = AiSetting::where('key', $setting['key'])->first();
            
            // Use existing type if available, otherwise default to string
            $type = $existingSetting ? $existingSetting->type : 'string';
            
            AiSetting::set($setting['key'], $setting['value'], $type);
        }

        // Detect which section/tab is being updated based on input
        $activeTab = 'primary'; // Default
        foreach ($validated['settings'] as $setting) {
            if (in_array($setting['key'], ['use_ollama_fallback', 'ollama_base_url', 'ollama_model', 'ollama_embedding_model'])) {
                $activeTab = 'ollama';
                break;
            }
            if (in_array($setting['key'], ['rag_enabled', 'rag_top_k'])) {
                $activeTab = 'rag';
                break;
            }
        }

        return redirect()->route('admin.ai-settings.index', ['tab' => $activeTab])
                        ->with('success', 'Pengaturan AI berhasil diperbarui.');
    }
}
