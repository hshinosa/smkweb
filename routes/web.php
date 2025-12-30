<?php

use App\Http\Controllers\AcademicCalendarPublicController;
use App\Http\Controllers\Admin\AcademicCalendarController;
use App\Http\Controllers\Admin\CurriculumController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\CloudflareStatsController;
use App\Http\Controllers\Admin\LandingPageContentController;
use App\Http\Controllers\Admin\SpmbContentController;
use App\Models\LandingPageSetting;
use App\Models\ProgramStudiSetting;
use App\Models\SpmbSetting;
use App\Models\Program;
use App\Models\Gallery;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $settings = LandingPageSetting::all()->keyBy('section_key');
    // Filter hanya Program Studi untuk Landing Page
    $featuredPrograms = Program::where('is_featured', true)
        ->where('category', 'Program Studi')
        ->orderBy('sort_order')
        ->get();
    $featuredGalleries = Gallery::where('is_featured', true)->latest()->get();

    // Helper untuk mendapatkan konten atau default
    $getContentOrDefault = function ($key, $defaults) use ($settings) {
        $content = $settings->get($key)?->content;
        
        // Handle JSON string or array
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : $defaults;
        }
        
        return $content ?? $defaults;
    };

    // Definisikan default di sini jika diperlukan (atau bisa juga di controller jika lebih kompleks)
    $defaultHero = [
        'title_line1' => 'Selamat Datang di',
        'title_line2' => 'SMA Negeri 1 Baleendah',
        'hero_text' => 'Sekolah penggerak prestasi dan inovasi masa depan. Kami berkomitmen mencetak lulusan yang cerdas, berakhlak mulia, dan siap bersaing di era global.',
        'background_image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
        'student_image_url' => '/images/anak-sma.png',
        'stats' => [
            ['label' => 'Akreditasi', 'value' => 'A', 'icon' => 'Trophy'],
            ['label' => 'Lulusan', 'value' => '15k+', 'icon' => 'GraduationCap'],
            ['label' => 'Siswa Aktif', 'value' => '1.2k+', 'icon' => 'Users'],
        ]
    ];
    $defaultAbout = [
        'title' => 'Tentang Kami',
        'description_html' => '<p>SMAN 1 Baleendah berdiri sejak tahun 1975 dan telah menjadi salah satu sekolah rujukan di Jawa Barat. Dengan visi menjadi sekolah unggul dalam prestasi dan berwawasan lingkungan, kami terus berinovasi dalam pembelajaran berbasis teknologi dan penguatan karakter.</p><p>Kami percaya bahwa setiap siswa memiliki potensi unik yang perlu dikembangkan melalui bimbingan yang tepat dan fasilitas yang memadai.</p>',
        'image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
    ];
    $defaultKepsek = [
        'title' => 'Sambutan Kepala Sekolah',
        'kepsek_name' => 'Drs. H. Ahmad Suryadi, M.Pd.',
        'kepsek_title' => 'Kepala SMA Negeri 1 Baleendah',
        'kepsek_image_url' => '/images/kepala-sekolah.jpg',
        'welcome_text_html' => '<p>Assalamu\'alaikum Warahmatullahi Wabarakatuh...</p><p>Saya mewakili seluruh warga SMA Negeri 1 Baleendah menyampaikan terima kasih atas kunjungan Anda ke website resmi kami...</p><p>Hormat kami,</p>',
    ];
    $defaultPrograms = [
        'title' => 'Program Akademik',
        'description' => 'Berbagai program inovatif yang dirancang untuk mengembangkan potensi siswa secara holistik.',
    ];
    $defaultGallery = [
        'title' => 'Galeri Sekolah',
        'description' => 'Momen-momen seru dan kegiatan inspiratif siswa-siswi SMAN 1 Baleendah.',
    ];
    $defaultCta = [
        'title' => 'Siap Menjadi Bagian dari Keluarga Besar SMAN 1 Baleendah?',
        'description' => 'Dapatkan informasi lengkap mengenai pendaftaran peserta didik baru, jadwal, dan persyaratan yang dibutuhkan.',
        'button_text' => 'Daftar Sekarang',
        'button_link' => '/informasi-spmb'
    ];

    $latestPosts = \App\Models\Post::where('status', 'published')
        ->where('published_at', '<=', now())
        ->latest('published_at')
        ->take(3)
        ->get();

    return Inertia::render('LandingPage', [
        // auth dan props lain yang sudah ada
        'heroContent' => $getContentOrDefault('hero', $defaultHero),
        'aboutLpContent' => $getContentOrDefault('about_lp', $defaultAbout),
        'kepsekWelcomeLpContent' => $getContentOrDefault('kepsek_welcome_lp', $defaultKepsek),
        'programsLpContent' => array_merge($getContentOrDefault('programs_lp', $defaultPrograms), ['items' => $featuredPrograms]),
        'galleryLpContent' => array_merge($getContentOrDefault('gallery_lp', $defaultGallery), ['images' => Gallery::where('type', 'photo')->latest()->pluck('url')->toArray()]),
        'ctaLpContent' => $getContentOrDefault('cta_lp', $defaultCta),
        'latestPosts' => $latestPosts,
        // ... props lain yang sudah Anda kirim ke LandingPage.jsx
    ]);
})->name('home'); // Beri nama jika belum

// Tambahkan rute baru untuk Informasi SPMB
Route::get('/informasi-spmb', function () {
    $settings = SpmbSetting::all()->keyBy('section_key');
    $spmbData = [];
    foreach (array_keys(SpmbSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $spmbData[$key] = SpmbSetting::getContent($key, $dbContent);
    }
    return Inertia::render('InformasiSpmbPage', [
        'spmbData' => $spmbData
    ]);
})->name('informasi.spmb'); // Opsional: beri nama rute

Route::get('/alumni', function () {
    $alumnis = \App\Models\Alumni::where('is_published', true)
        ->orderBy('sort_order')
        ->latest()
        ->get();
    
    return Inertia::render('AlumniPage', [
        'alumnis' => $alumnis
    ]);
})->name('alumni');

Route::get('/profil-sekolah', function () {
    $settings = \App\Models\SchoolProfileSetting::all()->keyBy('section_key');
    
    // Helper untuk mendapatkan konten dari settings
    $getSettingContent = function($key) use ($settings) {
        $content = $settings->get($key)?->content;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : null;
        }
        return $content;
    };
    
    $hero = \App\Models\SchoolProfileSetting::getContent('hero_history', $getSettingContent('hero_history'));
    $history = \App\Models\SchoolProfileSetting::getContent('history', $getSettingContent('history'));
    $facilities = \App\Models\SchoolProfileSetting::getContent('facilities', $getSettingContent('facilities'));
    
    return Inertia::render('ProfilSekolahPage', [
        'hero' => $hero,
        'history' => $history,
        'facilities' => $facilities
    ]);
})->name('profil.sekolah');

Route::get('/visi-misi', function () {
    $settings = \App\Models\SchoolProfileSetting::all()->keyBy('section_key');
    
    $getSettingContent = function($key) use ($settings) {
        $content = $settings->get($key)?->content;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : null;
        }
        return $content;
    };
    
    $hero = \App\Models\SchoolProfileSetting::getContent('hero_vision_mission', $getSettingContent('hero_vision_mission'));
    $visionMission = \App\Models\SchoolProfileSetting::getContent('vision_mission', $getSettingContent('vision_mission'));
    
    return Inertia::render('VisiMisiPage', [
        'hero' => $hero,
        'visionMission' => $visionMission
    ]);
})->name('visi.misi');

Route::get('/struktur-organisasi', function () {
    $settings = \App\Models\SchoolProfileSetting::all()->keyBy('section_key');
    
    $getSettingContent = function($key) use ($settings) {
        $content = $settings->get($key)?->content;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : null;
        }
        return $content;
    };
    
    $hero = \App\Models\SchoolProfileSetting::getContent('hero_organization', $getSettingContent('hero_organization'));
    $organization = \App\Models\SchoolProfileSetting::getContent('organization', $getSettingContent('organization'));
    
    return Inertia::render('StrukturOrganisasiPage', [
        'hero' => $hero,
        'organization' => $organization
    ]);
})->name('struktur.organisasi');

Route::get('/program', function () {
    return Inertia::render('ProgramSekolahPage', [
        'programs' => Program::orderBy('sort_order')->get()
    ]);
})->name('program.sekolah');

Route::get('/kalender-akademik', [AcademicCalendarPublicController::class, 'index'])->name('kalender.akademik');

// Route redirect login untuk mengatasi error "Route [login] not defined"
Route::get('/login', function () {
    return redirect()->route('admin.login.form');
})->name('login');

// Route untuk halaman akademik baru
Route::get('/akademik/kurikulum', function () {
    $programs = Program::where('category', 'Program Studi')->orderBy('sort_order')->get();
    $settings = \App\Models\CurriculumSetting::all()->keyBy('section_key');
    
    $curriculumData = [];
    foreach (array_keys(\App\Models\CurriculumSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $curriculumData[$key] = \App\Models\CurriculumSetting::getContent($key, $dbContent);
    }

    return Inertia::render('KurikulumPage', [
        'programs' => $programs,
        'curriculumData' => $curriculumData
    ]);
})->name('akademik.kurikulum');

Route::get('/akademik/ekstrakurikuler', function () {
    $extracurriculars = \App\Models\Extracurricular::where('is_active', true)->orderBy('sort_order')->get();
    return Inertia::render('EkstrakurikulerPage', [
        'extracurriculars' => $extracurriculars
    ]);
})->name('akademik.ekstrakurikuler');

// Helper untuk mendapatkan data program studi
$getProgramData = function ($programName) {
    $settings = ProgramStudiSetting::where('program_name', $programName)->get()->keyBy('section_key');
    $pageData = [];
    foreach (array_keys(ProgramStudiSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $pageData[$key] = ProgramStudiSetting::getContent($key, $dbContent);
    }
    return $pageData;
};

// Route untuk program studi
Route::get('/akademik/program-studi/mipa', function () use ($getProgramData) {
    return Inertia::render('ProgramMipaPage', [
        'content' => $getProgramData('mipa')
    ]);
})->name('akademik.program.mipa');

Route::get('/akademik/program-studi/ips', function () use ($getProgramData) {
    return Inertia::render('ProgramIpsPage', [
        'content' => $getProgramData('ips')
    ]);
})->name('akademik.program.ips');

Route::get('/akademik/program-studi/bahasa', function () use ($getProgramData) {
    return Inertia::render('ProgramBahasaPage', [
        'content' => $getProgramData('bahasa')
    ]);
})->name('akademik.program.bahasa');

// Route untuk halaman baru
Route::get('/berita-pengumuman', function () {
    $posts = \App\Models\Post::with('author')
        ->where('status', 'published')
        ->where('published_at', '<=', now())
        ->latest('published_at')
        ->get();

    $popularPosts = \App\Models\Post::where('status', 'published')
        ->orderBy('views_count', 'desc')
        ->take(5)
        ->get();

    return Inertia::render('BeritaPengumumanPage', [
        'posts' => $posts,
        'popularPosts' => $popularPosts
    ]);
})->name('berita.pengumuman');

Route::get('/berita/{slug}', function ($slug) {
    $post = \App\Models\Post::with('author')->where('slug', $slug)->firstOrFail();
    $post->increment('views_count');
    
    $relatedPosts = \App\Models\Post::where('id', '!=', $post->id)
        ->where('category', $post->category)
        ->where('status', 'published')
        ->latest('published_at')
        ->take(3)
        ->get();

    return Inertia::render('BeritaDetailPage', [
        'post' => $post,
        'relatedPosts' => $relatedPosts
    ]);
})->name('berita.detail');

Route::get('/kontak', function () {
    $faqs = \App\Models\Faq::where('is_published', true)
        ->orderBy('sort_order')
        ->get();
    
    return Inertia::render('KontakPage', [
        'faqs' => $faqs
    ]);
})->name('kontak');

Route::post('/kontak', [\App\Http\Controllers\ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('kontak.store');

// Route untuk galeri
Route::get('/galeri', function () {
    $galleries = Gallery::latest()->get();
    return Inertia::render('GaleriPage', [
        'galleries' => $galleries
    ]);
})->name('galeri');

// Route untuk guru & staff
Route::get('/guru-staff', function () {
    $teachers = \App\Models\Teacher::where('is_active', true)->orderBy('sort_order')->get();
    return Inertia::render('GuruStaffPage', [
        'teachers' => $teachers
    ]);
})->name('guru.staff');

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
        ->middleware(['guest:admin', 'throttle:10,1'])
        ->name('login.attempt');

    // Rute untuk logout (harus sudah login sebagai admin)
    Route::post('/logout', [AdminLoginController::class, 'destroy'])
        ->middleware('auth:admin') // Hanya yang terautentikasi guard admin
        ->name('logout');

    // Contoh rute dashboard admin (harus sudah login sebagai admin)
    Route::get('/dashboard', function () {
        $unreadMessagesCount = \App\Models\ContactMessage::where('is_read', false)->count();
        
        return Inertia::render('Admin/DashboardPage', [ // Pastikan path Inertia benar
            'admin' => Auth::guard('admin')->user(),
            'unreadMessagesCount' => $unreadMessagesCount,
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
        Route::get('/spmb-content', [SpmbContentController::class, 'index'])->name('spmb.index');
        Route::put('/spmb-content/update-all', [SpmbContentController::class, 'storeOrUpdate'])->name('spmb.update_all');

        // Program Studi Content Management Routes
        Route::get('/program-studi', [\App\Http\Controllers\Admin\ProgramStudiController::class, 'index'])->name('program-studi.index');
        Route::post('/program-studi/update-all', [\App\Http\Controllers\Admin\ProgramStudiController::class, 'storeOrUpdate'])->name('program-studi.update_all');

        // Program & Gallery Management Routes
        Route::resource('programs', \App\Http\Controllers\Admin\ProgramController::class);
        Route::resource('galleries', \App\Http\Controllers\Admin\GalleryController::class);

        // New Management Routes
        Route::post('/teachers/update-settings', [\App\Http\Controllers\Admin\TeacherController::class, 'updateSettings'])->name('teachers.update_settings');
        Route::resource('teachers', \App\Http\Controllers\Admin\TeacherController::class);
        Route::resource('posts', \App\Http\Controllers\Admin\PostController::class);
        Route::resource('alumni', \App\Http\Controllers\Admin\AlumniController::class);
        Route::post('/faqs/reorder', [\App\Http\Controllers\Admin\FaqController::class, 'reorder'])->name('faqs.reorder');
        Route::resource('faqs', \App\Http\Controllers\Admin\FaqController::class);
        Route::get('/school-profile', [\App\Http\Controllers\Admin\SchoolProfileController::class, 'index'])->name('school-profile.index');
        Route::post('/school-profile', [\App\Http\Controllers\Admin\SchoolProfileController::class, 'update'])->name('school-profile.update');
        Route::get('/kurikulum', [CurriculumController::class, 'index'])->name('curriculum.index');
        Route::post('/kurikulum', [CurriculumController::class, 'update'])->name('curriculum.update');
        Route::get('/site-settings', [\App\Http\Controllers\Admin\SiteSettingController::class, 'index'])->name('site-settings.index');
        Route::post('/site-settings', [\App\Http\Controllers\Admin\SiteSettingController::class, 'update'])->name('site-settings.update');
        
        // Contact Messages
        Route::get('/contact-messages', [\App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('contact-messages.index');
        Route::get('/contact-messages/{contactMessage}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'show'])->name('contact-messages.show');
        Route::delete('/contact-messages/{contactMessage}', [\App\Http\Controllers\Admin\ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');

        Route::resource('extracurriculars', \App\Http\Controllers\Admin\ExtracurricularController::class);

        // RAG Documents Management
        Route::resource('rag-documents', \App\Http\Controllers\Admin\RagDocumentController::class);
        Route::post('/rag-documents/{ragDocument}/reprocess', [\App\Http\Controllers\Admin\RagDocumentController::class, 'reprocess'])->name('rag-documents.reprocess');

        // AI Settings Management
        Route::get('/ai-settings', [\App\Http\Controllers\Admin\AiSettingController::class, 'index'])->name('ai-settings.index');
        Route::post('/ai-settings', [\App\Http\Controllers\Admin\AiSettingController::class, 'update'])->name('ai-settings.update');
    });
});
// --- AKHIR RUTE ADMIN ---

// --- API ROUTES FOR CHATBOT ---
Route::prefix('api')->name('api.')->group(function () {
    Route::post('/chat/send', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage'])
        ->middleware('throttle:30,1')
        ->name('chat.send');
    
    Route::get('/chat/history', [\App\Http\Controllers\Api\ChatController::class, 'getHistory'])
        ->name('chat.history');
});
// --- AKHIR API ROUTES ---

// --- SEO ROUTES ---
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [\App\Http\Controllers\SitemapController::class, 'robots'])->name('robots');
// --- AKHIR SEO ROUTES ---
