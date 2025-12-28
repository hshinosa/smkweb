<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Rate limiting: max 3 messages per minute per IP
        if ($request->session()->has('last_message_time')) {
            $lastTime = $request->session()->get('last_message_time');
            if (now()->diffInSeconds($lastTime) < 60) {
                return back()->with('error', 'Mohon tunggu sebentar sebelum mengirim pesan lagi.');
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $cleaned = Arr::map($validated, function ($value) {
            return is_string($value) ? trim(strip_tags($value)) : $value;
        });

        ContactMessage::create($cleaned);

        $request->session()->put('last_message_time', now());

        return back()->with('success', 'Pesan Anda telah terkirim. Terima kasih telah menghubungi kami!');
    }
}
