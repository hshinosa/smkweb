<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CloudflareStatsController;
use App\Http\Controllers\Admin\LandingPageContentController;
use App\Http\Controllers\Admin\SpmbContentController;
use App\Http\Controllers\Admin\AcademicCalendarController;
use App\Http\Controllers\AcademicCalendarPublicController;
use App\Models\LandingPageSetting;

Route::get('/', function () {
    $settings = LandingPageSetting::all()->keyBy('section_key');

    // Helper untuk mendapatkan konten atau default
    $getContentOrDefault = function ($key, $defaults) use ($settings) {
        return $settings->get($key)['content'] ?? $defaults;
    };

    // Definisikan default di sini jika diperlukan (atau bisa juga di controller jika lebih kompleks)
    $defaultHero = [
        'title_line1' => 'Selamat Datang di',
        'title_line2' => 'SMK Negeri 15 Bandung',
        'background_image_url' => '/images/hero-bg-smkn15.jpg',
    ];
    $defaultAbout = [
        'title' => 'Tentang Kami (Default)',
        'description_html' => '<p>Deskripsi default tentang sekolah...</p>',
        'image_url' => '/images/keluarga-besar-smkn15.png',
    ];
     $defaultKepsek = [
        'title' => 'Sambutan Kepala Sekolah (Default)',
        'kepsek_name' => 'Dra. Lilis Yuyun, M.M.Pd.',
        'kepsek_title' => 'Kepala SMK Negeri 15 Bandung',
        'kepsek_image_url' => '/images/kepala-sekolah.jpg',
        'welcome_text_html' => '<p>Assalamu\'alaikum Warahmatullahi Wabarakatuh...</p><p>Saya mewakili seluruh warga SMK Negeri 15 Bandung menyampaikan terima kasih atas kunjungan Anda ke website resmi kami...</p><p>Hormat kami,</p>',
    ];
    $defaultFakta = [
        'items' => [
            ['label' => 'Guru', 'value' => 0],
            ['label' => 'Siswa', 'value' => 0],
        ]
    ];

    return Inertia::render('LandingPage', [
        // auth dan props lain yang sudah ada
        'heroContent' => $getContentOrDefault('hero', $defaultHero),
        'aboutLpContent' => $getContentOrDefault('about_lp', $defaultAbout),
        'kepsekWelcomeLpContent' => $getContentOrDefault('kepsek_welcome_lp', $defaultKepsek),
        'faktaLpContent' => $getContentOrDefault('fakta_lp', $defaultFakta),
        // ... props lain yang sudah Anda kirim ke LandingPage.jsx
    ]);
})->name('home'); // Beri nama jika belum

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

Route::get('/kalender-akademik', [AcademicCalendarPublicController::class, 'index'])->name('kalender.akademik');

// --- RUTE ADMIN ---
Route::prefix('admin')->name('admin.')->group(function () {
    // Base route for /admin
    Route::get('/', function () {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('admin.login.form');
    })->name('index');

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
        Route::get('/api/activity-logs', [ActivityLogController::class, 'index'])->name('api.activitylogs.index');
        Route::get('/api/cloudflare-stats', [CloudflareStatsController::class, 'getUniqueVisitors'])->name('api.cloudflare.stats');
        Route::get('/api/cloudflare-chart-stats', [CloudflareStatsController::class, 'getVisitorStatsForChart'])->name('api.cloudflare.chart.stats');
        Route::get('/landing-page-content', [LandingPageContentController::class, 'index'])->name('landingpage.content.index');
        // Menggunakan PUT atau POST. PUT lebih cocok untuk update resource keseluruhan.
        Route::post('/landing-page-content/update-all', [LandingPageContentController::class, 'storeOrUpdate'])->name('landingpage.content.update_all');
        
        // Academic Calendar Content Routes
        Route::resource('academic-calendar', AcademicCalendarController::class)->except(['show']);
        Route::patch('/academic-calendar/{content}/set-active', [AcademicCalendarController::class, 'setActive'])->name('academic-calendar.set-active');
        
        // SPMB Content Management Routes
        Route::get('/spmb-content', [SpmbContentController::class, 'index'])->name('spmb.content.index');
        Route::put('/spmb-content/update-all', [SpmbContentController::class, 'storeOrUpdate'])->name('spmb.content.update_all');
    });
});
// --- AKHIR RUTE ADMIN ---