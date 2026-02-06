<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

use App\Http\Requests\AiSettingRequest;
use Illuminate\Support\Facades\DB;

class AiSettingController extends Controller
{
    public function index()
    {
        $settings = AiSetting::all()->groupBy('key')->map(fn($group) => $group->first());

        return Inertia::render('Admin/AiSettings/Index', [
            'settings' => $settings->values(),
        ]);
    }

    public function models()
    {
        $models = [];

        $baseUrl = AiSetting::get('ai_model_base_url', '');
        $apiKey = AiSetting::get('ai_model_api_key', '');

        if (!empty($baseUrl) && !empty($apiKey)) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(5)->get("{$baseUrl}/models");

                if ($response->successful()) {
                    $data = $response->json();
                    $models = array_merge($models, $data['data'] ?? []);
                }
            } catch (\Exception $e) {
                Log::warning('AI models fetch failed: ' . $e->getMessage());
            }
        }

        $ollamaBaseUrl = AiSetting::get('ollama_base_url', '');

        if (!empty($ollamaBaseUrl)) {
            try {
                $response = Http::timeout(3)->get("{$ollamaBaseUrl}/api/tags");

                if ($response->successful()) {
                    $data = $response->json();
                    $ollamaModels = $data['models'] ?? [];

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
                Log::warning('Ollama models fetch failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'models' => $models,
        ]);
    }

    public function update(AiSettingRequest $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            
            foreach ($validated['settings'] as $setting) {
                $existingSetting = AiSetting::where('key', $setting['key'])->first();
                $type = $existingSetting ? $existingSetting->type : 'string';
                $value = $setting['value'];
                
                if (is_string($value)) {
                    $value = strip_tags($value);
                }
                
                AiSetting::set($setting['key'], $value, $type);
            }

            $activeTab = 'primary';
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

            DB::commit();
            return redirect()->route('admin.ai-settings.index', ['tab' => $activeTab])
                            ->with('success', 'Pengaturan AI berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update AI settings: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Gagal memperbarui pengaturan AI.']);
        }
    }
}
