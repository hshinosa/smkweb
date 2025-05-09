<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\Auth\PasswordController as AdminPasswordController;
use App\Http\Controllers\Admin\CloudflareStatsController;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

// Tambahkan rute baru untuk Informasi SPMB
Route::get('/informasi-spmb', function () {
    return Inertia::render('InformasiSpmbPage');
})->name('informasi.spmb'); // Opsional: beri nama rute

Route::get('/profil-sekolah', function () {
    return Inertia::render('ProfilSekolahPage');
})->name('profil.sekolah');

Route::get('/visi-misi', function () {
    return Inertia::render('VisiMisiPage');
})->name('visi.misi');

Route::get('/struktur-organisasi', function () {
    return Inertia::render('StrukturOrganisasiPage');
})->name('struktur.organisasi');

Route::get('/program', function () {
    return Inertia::render('ProgramSekolahPage');
})->name('program.sekolah');

// --- RUTE ADMIN ---
Route::prefix('admin')->name('admin.')->group(function () {
    // Rute untuk menampilkan form login (hanya bisa diakses guest admin)
    Route::get('/login', [AdminLoginController::class, 'create'])
        ->middleware('guest:admin') // Hanya guest dari guard admin
        ->name('login.form');

    

    // Rute untuk memproses login
    Route::post('/login', [AdminLoginController::class, 'store'])
        ->middleware('guest:admin')
        ->name('login.attempt');

    // Rute untuk logout (harus sudah login sebagai admin)
    Route::post('/logout', [AdminLoginController::class, 'destroy'])
        ->middleware('auth:admin') // Hanya yang terautentikasi guard admin
        ->name('logout');

    // Contoh rute dashboard admin (harus sudah login sebagai admin)
    Route::get('/dashboard', function () {
    return Inertia::render('Admin/DashboardPage', [ // Pastikan path Inertia benar
        'admin' => Auth::guard('admin')->user()
    ]);
    })->middleware('auth:admin')->name('dashboard');

    Route::middleware('auth:admin')->group(function () {
        // ...
        Route::put('/password', [AdminPasswordController::class, 'update'])->name('password.update');
        Route::get('/api/activity-logs', [ActivityLogController::class, 'index'])->name('api.activitylogs.index');
        Route::get('/api/cloudflare-stats', [CloudflareStatsController::class, 'getUniqueVisitors'])->name('api.cloudflare.stats');
    });
});
// --- AKHIR RUTE ADMIN ---