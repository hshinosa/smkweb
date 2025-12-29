<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiSetting;
use Illuminate\Http\Request;
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            $existingSetting = AiSetting::where('key', $setting['key'])->first();
            
            if ($existingSetting) {
                AiSetting::set($setting['key'], $setting['value'], $existingSetting->type);
            }
        }

        return back()->with('success', 'Pengaturan AI berhasil diperbarui.');
    }
}
