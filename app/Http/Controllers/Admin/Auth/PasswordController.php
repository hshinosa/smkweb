<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class PasswordController extends Controller
{
    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validated = $request->validateWithBag('updatePassword', [ // Nama error bag
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $admin->forceFill([
            'password' => $validated['password'], // Model Admin akan otomatis hash
        ])->save();

        return back()->with('status', 'password-updated'); // Kirim status ini
    }
}