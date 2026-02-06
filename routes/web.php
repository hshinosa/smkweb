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
use App\Services\ImageService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $imageService = new ImageService();
    $settings = LandingPageSetting::with('media')->get()->keyBy('section_key');
    
    // Get thumbnail images from Program Studi Settings
    $programStudiThumbnails = \App\Models\ProgramStudiSetting::with('media')
        ->where('section_key', 'hero')
        ->get()
        ->mapWithKeys(function ($setting) use ($imageService) {
            $thumbnail = null;
            $thumbnailUrl = null;
            
            // Try to get media object first
            $thumbnailMedia = $imageService->getFirstMediaData($setting, 'thumbnail_card');
            if ($thumbnailMedia) {
                $thumbnail = $thumbnailMedia; // Media object for ResponsiveImage
                $thumbnailUrl = $thumbnailMedia['original_url'] ?? null;
            } else {
                // Fallback to stored URL
                $mediaUrl = $setting->getFirstMediaUrl('thumbnail_card');
                if ($mediaUrl) {
                    $thumbnailUrl = $mediaUrl;
                } elseif ($setting->thumbnail_card_url) {
                    $thumbnailUrl = asset($setting->thumbnail_card_url);
                }
            }
            
            return [$setting->program_name => [
                'media' => $thumbnail,
                'url' => $thumbnailUrl
            ]];
        });
    
    // Filter hanya Program Studi untuk Landing Page
    $featuredProgramsQuery = Program::where('is_featured', true)
        ->where('category', 'Program Studi')
        ->orderBy('sort_order')
        ->with('media') // Load media relationship
        ->get();

    // Transform programs to include responsive image data and thumbnail from ProgramStudiSetting
    $featuredPrograms = $featuredProgramsQuery->map(function ($program) use ($imageService, $programStudiThumbnails) {
        $data = $program->toArray();
        
        // Map program title to program_name (more reliable than slug)
        $programTitle = strtolower($program->title ?? '');
        $programKey = null;
        
        if (str_contains($programTitle, 'mipa') || $programTitle === 'mipa') {
            $programKey = 'mipa';
        } elseif (str_contains($programTitle, 'ips') || $programTitle === 'ips') {
            $programKey = 'ips';
        } elseif (str_contains($programTitle, 'bahasa') || $programTitle === 'bahasa') {
            $programKey = 'bahasa';
        } else {
            // Fallback to slug
            $programSlug = strtolower($program->slug ?? '');
            if (str_contains($programSlug, 'mipa') || str_contains($programSlug, 'ipa')) {
                $programKey = 'mipa';
            } elseif (str_contains($programSlug, 'ips')) {
                $programKey = 'ips';
            } elseif (str_contains($programSlug, 'bahasa')) {
                $programKey = 'bahasa';
            }
        }
        
        // Initialize with null values
        $data['image'] = null;
        $data['image_url'] = null;
        
        // Use thumbnail from ProgramStudiSetting if available, otherwise use program's own image
        if ($programKey && isset($programStudiThumbnails[$programKey])) {
            $thumbnailData = $programStudiThumbnails[$programKey];
            if (!empty($thumbnailData['media'])) {
                $data['image'] = $thumbnailData['media']; // Media object for ResponsiveImage
            }
            if (!empty($thumbnailData['url'])) {
                $data['image_url'] = $thumbnailData['url']; // Fallback URL
            }
        }
        
        // If no thumbnail from ProgramStudiSetting, use program's own image
        if (empty($data['image']) && empty($data['image_url'])) {
            $media = $imageService->getFirstMediaData($program, 'program_image');
            if ($media) {
                $data['image'] = $media; // Inject media object
                $data['image_url'] = $media['original_url'] ?? null;
            } else {
                // Final fallback to image_name field
                $data['image_url'] = $program->image_name ? "/images/{$program->image_name}" : "/images/anak-sma-programstudi.png";
            }
        }
        
        return $data;
    });
    $featuredGalleries = Gallery::where('is_featured', true)->latest()->get();

    // Helper untuk mendapatkan konten atau default
    $getContentOrDefault = function ($key, $defaults) use ($settings, $imageService) {
        $dbRow = $settings->get($key);
        $content = $dbRow?->content;
        
        // Handle JSON string or array
        $finalContent = $defaults;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            $finalContent = is_array($decoded) ? $decoded : $defaults;
        } elseif (is_array($content)) {
            $finalContent = $content;
        }

        // Inject Media Library Data (WebP conversions)
        if ($dbRow) {
            if ($key === 'hero') {
                $bgMedia = $imageService->getFirstMediaData($dbRow, 'hero_background');
                if ($bgMedia) $finalContent['backgroundImage'] = $bgMedia;

                $studentMedia = $imageService->getFirstMediaData($dbRow, 'hero_student');
                if ($studentMedia) $finalContent['studentImage'] = $studentMedia;
            } elseif ($key === 'about_lp') {
                $aboutMedia = $imageService->getFirstMediaData($dbRow, 'about_image');
                if ($aboutMedia) $finalContent['aboutImage'] = $aboutMedia; // Note: Frontend expects 'image' or specific prop? Check prop mapping.
                // Actually frontend might expect just url string from content if media object not present, 
                // but ResponsiveImage component checks for 'media' prop usually passed as separate prop or nested.
                // Let's stick to injecting it into content array, LandingPage.jsx destructures it.
            } elseif ($key === 'kepsek_welcome_lp') {
                $kepsekMedia = $imageService->getFirstMediaData($dbRow, 'kepsek_image');
                if ($kepsekMedia) $finalContent['kepsekImage'] = $kepsekMedia;
            }
        }
        
        return $finalContent;
    };

    // Definisikan default di sini jika diperlukan (atau bisa juga di controller jika lebih kompleks)
    $defaultHero = [
        'title_line1' => 'Selamat Datang di',
        'title_line2' => 'SMA Negeri 1 Baleendah',
        'hero_text' => 'Sekolah penggerak prestasi dan inovasi masa depan. Kami berkomitmen mencetak lulusan yang cerdas, berakhlak mulia, dan siap bersaing di era global.',
        'background_image_url' => '/images/hero-bg-sman1baleendah.jpeg',
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
        'image_url' => '/images/hero-bg-sman1baleendah.jpeg',
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
        ->with('media')
        ->get()
        ->map(function ($post) use ($imageService) {
            $data = $post->toArray();
            $media = $imageService->getFirstMediaData($post, 'featured');
            if ($media) {
                $data['featuredImage'] = $media;
                $data['featured_image'] = $media['original_url'];
            }
            return $data;
        });

    // Gallery Images for Carousel (WebP preferred)
    $galleryImages = Gallery::where('type', 'photo')
        ->latest()
        ->take(12)
        ->with('media')
        ->get()
        ->map(function ($gallery) use ($imageService) {
            $media = $imageService->getFirstMediaData($gallery, 'images');
            return $media ? ($media['conversions']['webp'] ?? $media['original_url']) : $gallery->url;
        })
        ->values()
        ->toArray();

    return Inertia::render('LandingPage', [
        // auth dan props lain yang sudah ada
        'heroContent' => $getContentOrDefault('hero', $defaultHero),
        'aboutLpContent' => $getContentOrDefault('about_lp', $defaultAbout),
        'kepsekWelcomeLpContent' => $getContentOrDefault('kepsek_welcome_lp', $defaultKepsek),
        'programsLpContent' => array_merge($getContentOrDefault('programs_lp', $defaultPrograms), ['items' => $featuredPrograms]),
        'galleryLpContent' => array_merge($getContentOrDefault('gallery_lp', $defaultGallery), ['images' => $galleryImages]),
        'ctaLpContent' => $getContentOrDefault('cta_lp', $defaultCta),
        'latestPosts' => $latestPosts,
        // ... props lain yang sudah Anda kirim ke LandingPage.jsx
    ]);
})->name('home'); // Beri nama jika belum

// Tambahkan rute baru untuk Informasi SPMB
Route::get('/informasi-spmb', function () {
    $imageService = new \App\Services\ImageService();
    $settings = \App\Models\SpmbSetting::with('media')->get()->keyBy('section_key');
    
    $spmbData = [];
    foreach (array_keys(\App\Models\SpmbSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $content = \App\Models\SpmbSetting::getContent($key, $dbContent);
        
        // Inject Media
        if ($dbRow) {
            if ($key === 'pengaturan_umum') {
                $media = $imageService->getFirstMediaData($dbRow, 'banner_image');
                if ($media) $content['banner_image'] = $media;
            }
        }
        
        $spmbData[$key] = $content;
    }
    return Inertia::render('InformasiSpmbPage', [
        'spmbData' => $spmbData
    ]);
})->name('informasi.spmb'); // Opsional: beri nama rute

Route::get('/alumni', function () {
    $imageService = new \App\Services\ImageService();
    $alumnis = \App\Models\Alumni::where('is_published', true)
        ->orderBy('sort_order')
        ->latest()
        ->with('media')
        ->get()
        ->map(function ($alumni) use ($imageService) {
            $data = $alumni->toArray();
            
            // Get avatar/profile image
            $avatarMedia = $imageService->getFirstMediaData($alumni, 'avatars');
            if ($avatarMedia) {
                $data['avatarsImage'] = $avatarMedia;
                $data['image_url'] = $avatarMedia['original_url'];
            }
            
            // Get video media for uploaded videos
            if ($alumni->content_type === 'video' && $alumni->video_source === 'upload') {
                $videoMedia = $alumni->getFirstMedia('videos');
                if ($videoMedia) {
                    $data['video_url'] = $videoMedia->getUrl();
                    $data['videoMedia'] = [
                        'id' => $videoMedia->id,
                        'original_url' => $videoMedia->getUrl(),
                        'mime_type' => $videoMedia->mime_type,
                        'file_name' => $videoMedia->file_name,
                        'size' => $videoMedia->size,
                    ];
                }
            }
            
            // Get video thumbnail
            $thumbnailMedia = $imageService->getFirstMediaData($alumni, 'video_thumbnails');
            if ($thumbnailMedia) {
                $data['video_thumbnail_url'] = $thumbnailMedia['original_url'];
                $data['videoThumbnailImage'] = $thumbnailMedia;
            }
            
            return $data;
        });
    
    return Inertia::render('AlumniPage', [
        'alumnis' => $alumnis
    ]);
})->name('alumni');

Route::get('/profil-sekolah', function () {
    $imageService = new \App\Services\ImageService();
    $settings = \App\Models\SchoolProfileSetting::with('media')->get()->keyBy('section_key');
    
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
    // Inject Media
    $heroRow = $settings->get('hero_history');
    if ($heroRow) {
        $bgMedia = $imageService->getFirstMediaData($heroRow, 'hero_history_bg');
        if ($bgMedia) $hero['backgroundImage'] = $bgMedia;
    }

    $history = \App\Models\SchoolProfileSetting::getContent('history', $getSettingContent('history'));
    $facilities = \App\Models\SchoolProfileSetting::getContent('facilities', $getSettingContent('facilities'));
    
    // Inject Media for facilities items
    $facilitiesRow = $settings->get('facilities');
    if ($facilitiesRow && isset($facilities['items']) && is_array($facilities['items'])) {
        foreach ($facilities['items'] as $index => &$item) {
            $media = $imageService->getFirstMediaData($facilitiesRow, "facilities_item_{$index}");
            if ($media) {
                $item['image'] = $media;
                $item['image_url'] = $media['original_url'];
            }
        }
    }
    
    return Inertia::render('ProfilSekolahPage', [
        'hero' => $hero,
        'history' => $history,
        'facilities' => $facilities
    ]);
})->name('profil.sekolah');

Route::get('/visi-misi', function () {
    $imageService = new \App\Services\ImageService();
    $settings = \App\Models\SchoolProfileSetting::with('media')->get()->keyBy('section_key');
    
    $getSettingContent = function($key) use ($settings) {
        $content = $settings->get($key)?->content;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : null;
        }
        return $content;
    };
    
    $hero = \App\Models\SchoolProfileSetting::getContent('hero_vision_mission', $getSettingContent('hero_vision_mission'));
    
    // Inject Media
    $heroRow = $settings->get('hero_vision_mission');
    if ($heroRow) {
        $bgMedia = $imageService->getFirstMediaData($heroRow, 'hero_vision_mission_bg');
        if ($bgMedia) $hero['backgroundImage'] = $bgMedia;
    }

    $visionMission = \App\Models\SchoolProfileSetting::getContent('vision_mission', $getSettingContent('vision_mission'));
    
    return Inertia::render('VisiMisiPage', [
        'hero' => $hero,
        'visionMission' => $visionMission
    ]);
})->name('visi.misi');

Route::get('/prestasi-akademik', function () {
    $batches = \App\Models\PtnAdmissionBatch::with(['admissions.university'])
        ->published()
        ->ordered()
        ->get()
        ->map(function ($batch) {
            // Group by University for Pie Chart & Details
            $byPTN = $batch->admissions
                ->groupBy('university_id')
                ->map(function ($items) {
                    $first = $items->first();
                    
                    // Group majors within this university
                    $majors = $items->map(function ($item) {
                        return [
                            'name' => $item->program_studi,
                            'count' => $item->count
                        ];
                    })->sortByDesc('count')->values();

                    return [
                        'id' => $first->university_id,
                        'name' => $first->university->short_name ?? $first->university->name,
                        'fullName' => $first->university->name,
                        'count' => $items->sum('count'),
                        'color' => $first->university->color ?? '#6B7280',
                        'majors' => $majors
                    ];
                })
                ->sortByDesc('count')
                ->values();

            return [
                'id' => $batch->id,
                'name' => $batch->name,
                'type' => $batch->type,
                'year' => $batch->year,
                'total' => $batch->total_students,
                'byPTN' => $byPTN,
            ];
        });

    $universities = \App\Models\PtnUniversity::active()
        ->ordered()
        ->get()
        ->map(function ($uni) {
            return [
                'id' => $uni->id,
                'name' => $uni->name,
                'shortName' => $uni->short_name,
                'color' => $uni->color,
            ];
        });

    $totalAdmissions = \App\Models\PtnAdmission::sum('count');
    
    // Count unique universities that have admissions
    $totalPtn = \App\Models\PtnAdmission::distinct('university_id')->count('university_id');

    // Top 4 Favorite PTNs across all batches
    $ptnFavorites = \App\Models\PtnAdmission::with('university')
        ->selectRaw('university_id, SUM(count) as total')
        ->groupBy('university_id')
        ->orderByDesc('total')
        ->take(4)
        ->get()
        ->map(function ($item) {
            return [
                'name' => $item->university->short_name ?? $item->university->name,
                'fullName' => $item->university->name,
                'total' => (int) $item->total,
                'color' => $item->university->color,
            ];
        });

    return Inertia::render('PrestasiAkademikPage', [
        'batches' => $batches,
        'universities' => $universities,
        'stats' => [
            'totalAdmissions' => (int) $totalAdmissions,
            'totalPtn' => $totalPtn,
        ],
        'ptnFavorites' => $ptnFavorites,
    ]);
})->name('prestasi.akademik');

Route::get('/hasil-tka', function () {
    $tkaGroups = \App\Models\TkaAverage::select('academic_year', 'exam_type')
        ->groupBy('academic_year', 'exam_type')
        ->orderByDesc('academic_year')
        ->get()
        ->map(function ($group) {
            $subjects = \App\Models\TkaAverage::where('academic_year', $group->academic_year)
                ->where('exam_type', $group->exam_type)
                ->get();
            
            return [
                'academic_year' => $group->academic_year,
                'exam_type' => $group->exam_type,
                'subjects' => $subjects
            ];
        });

    return Inertia::render('HasilTkaPage', [
        'tkaGroups' => $tkaGroups
    ]);
})->name('hasil.tka');

Route::get('/struktur-organisasi', function () {
    $imageService = new \App\Services\ImageService();
    $settings = \App\Models\SchoolProfileSetting::with('media')->get()->keyBy('section_key');
    
    $getSettingContent = function($key) use ($settings) {
        $content = $settings->get($key)?->content;
        if (is_string($content)) {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : null;
        }
        return $content;
    };
    
    $hero = \App\Models\SchoolProfileSetting::getContent('hero_organization', $getSettingContent('hero_organization'));
    // Inject Media Hero
    $heroRow = $settings->get('hero_organization');
    if ($heroRow) {
        $bgMedia = $imageService->getFirstMediaData($heroRow, 'hero_organization_bg');
        if ($bgMedia) $hero['backgroundImage'] = $bgMedia;
    }

    $organization = \App\Models\SchoolProfileSetting::getContent('organization', $getSettingContent('organization'));
    // Inject Media Chart
    $orgRow = $settings->get('organization');
    if ($orgRow) {
        $chartMedia = $imageService->getFirstMediaData($orgRow, 'organization');
        if ($chartMedia) $organization['chartImage'] = $chartMedia;
    }
    
    return Inertia::render('StrukturOrganisasiPage', [
        'hero' => $hero,
        'organization' => $organization
    ]);
})->name('struktur.organisasi');

Route::get('/program', function () {
    $imageService = new \App\Services\ImageService();
    
    // Ambil semua program KECUALI Program Studi
    $programsQuery = Program::where('category', '!=', 'Program Studi')
        ->orderBy('sort_order')
        ->with('media')
        ->get();

    // Transform programs to include responsive image data
    $programs = $programsQuery->map(function ($program) use ($imageService) {
        $data = $program->toArray();
        $media = $imageService->getFirstMediaData($program, 'program_image');
        if ($media) {
            $data['image'] = $media; // Inject media object
        }
        return $data;
    });

    // Hero Program Settings
    $heroSetting = \App\Models\SiteSetting::where('section_key', 'hero_program')->first();
    $heroData = [];
    
    if ($heroSetting) {
        $content = $heroSetting->content;
        if (is_string($content)) {
            $heroData = json_decode($content, true) ?? [];
        } else {
            $heroData = $content ?? [];
        }
        
        // Inject Media
        $bgMedia = $imageService->getFirstMediaData($heroSetting, 'hero_program_bg');
        if ($bgMedia) $heroData['backgroundImage'] = $bgMedia;
    }

    return Inertia::render('ProgramSekolahPage', [
        'programs' => $programs,
        'heroSettings' => $heroData
    ]);
})->name('program.sekolah');

Route::get('/kalender-akademik', [AcademicCalendarPublicController::class, 'index'])->name('kalender.akademik');

// Route redirect login untuk mengatasi error "Route [login] not defined"
Route::get('/login', function () {
    return redirect()->route('admin.login.form');
})->name('login');

// Route untuk halaman akademik baru
Route::get('/akademik/kurikulum', function () {
    $imageService = new \App\Services\ImageService();
    
    // Get thumbnail images from Program Studi Settings
    $programStudiThumbnails = \App\Models\ProgramStudiSetting::with('media')
        ->where('section_key', 'hero')
        ->get()
        ->mapWithKeys(function ($setting) use ($imageService) {
            $thumbnail = null;
            $thumbnailUrl = null;
            
            // Try to get media object first
            $thumbnailMedia = $imageService->getFirstMediaData($setting, 'thumbnail_card');
            if ($thumbnailMedia) {
                $thumbnail = $thumbnailMedia; // Media object for ResponsiveImage
                $thumbnailUrl = $thumbnailMedia['original_url'] ?? null;
            } else {
                // Fallback to stored URL
                $mediaUrl = $setting->getFirstMediaUrl('thumbnail_card');
                if ($mediaUrl) {
                    $thumbnailUrl = $mediaUrl;
                } elseif ($setting->thumbnail_card_url) {
                    $thumbnailUrl = asset($setting->thumbnail_card_url);
                }
            }
            
            return [$setting->program_name => [
                'media' => $thumbnail,
                'url' => $thumbnailUrl
            ]];
        });
    
    // Programs with Media and Thumbnail from ProgramStudiSetting
    $programs = Program::where('category', 'Program Studi')
        ->orderBy('sort_order')
        ->with('media')
        ->get()
        ->map(function ($program) use ($imageService, $programStudiThumbnails) {
            $data = $program->toArray();
            
            // Map program title to program_name (more reliable than slug)
            $programTitle = strtolower($program->title ?? '');
            $programKey = null;
            
            if (str_contains($programTitle, 'mipa') || $programTitle === 'mipa') {
                $programKey = 'mipa';
            } elseif (str_contains($programTitle, 'ips') || $programTitle === 'ips') {
                $programKey = 'ips';
            } elseif (str_contains($programTitle, 'bahasa') || $programTitle === 'bahasa') {
                $programKey = 'bahasa';
            } else {
                // Fallback to slug
                $programSlug = strtolower($program->slug ?? '');
                if (str_contains($programSlug, 'mipa') || str_contains($programSlug, 'ipa')) {
                    $programKey = 'mipa';
                } elseif (str_contains($programSlug, 'ips')) {
                    $programKey = 'ips';
                } elseif (str_contains($programSlug, 'bahasa')) {
                    $programKey = 'bahasa';
                }
            }
            
            // Initialize with null values
            $data['image'] = null;
            $data['image_url'] = null;
            
            // Use thumbnail from ProgramStudiSetting if available
            if ($programKey && isset($programStudiThumbnails[$programKey])) {
                $thumbnailData = $programStudiThumbnails[$programKey];
                if (!empty($thumbnailData['media'])) {
                    $data['image'] = $thumbnailData['media'];
                }
                if (!empty($thumbnailData['url'])) {
                    $data['image_url'] = $thumbnailData['url'];
                }
            }
            
            // If no thumbnail from ProgramStudiSetting, use program's own image
            if (empty($data['image']) && empty($data['image_url'])) {
                $media = $imageService->getFirstMediaData($program, 'program_image');
                if ($media) {
                    $data['image'] = $media;
                    $data['image_url'] = $media['original_url'] ?? null;
                } else {
                    // Final fallback to image_name field
                    $data['image_url'] = $program->image_name ? "/images/{$program->image_name}" : "/images/anak-sma-programstudi.png";
                }
            }
            
            return $data;
        });

    $settings = \App\Models\CurriculumSetting::with('media')->get()->keyBy('section_key');
    $mediaCollections = \App\Models\CurriculumSetting::getMediaCollections();
    
    $curriculumData = [];
    foreach (array_keys(\App\Models\CurriculumSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $content = \App\Models\CurriculumSetting::getContent($key, $dbContent);

        if ($dbRow && isset($mediaCollections[$key])) {
            $media = $imageService->getFirstMediaData($dbRow, $mediaCollections[$key]);
            if ($media) {
                $content['image'] = $media;
            }
        }

        $curriculumData[$key] = $content;
    }

    return Inertia::render('KurikulumPage', [
        'programs' => $programs,
        'curriculumData' => $curriculumData
    ]);
})->name('akademik.kurikulum');

Route::get('/akademik/organisasi-ekstrakurikuler', function () {
    $extracurriculars = \App\Models\Extracurricular::where('is_active', true)
        ->orderBy('sort_order')
        ->with('media')
        ->get()
        ->map(function ($ekskul) {
            // toArray() already includes accessors (image_url, bg_image_url, profile_image_url)
            return $ekskul->toArray();
        });

    return Inertia::render('EkstrakurikulerPage', [
        'extracurriculars' => $extracurriculars
    ]);
})->name('akademik.organisasi_ekstrakurikuler');

Route::get('/akademik/kalender-akademik', function () {
    $imageService = new \App\Services\ImageService();
    $calendars = \App\Models\AcademicCalendarContent::where('is_active', true)
        ->orderBy('academic_year_start', 'desc')
        ->orderBy('semester', 'asc')
        ->orderBy('sort_order', 'asc')
        ->with('media')
        ->get()
        ->map(function ($cal) use ($imageService) {
            $data = $cal->toArray();
            $media = $imageService->getFirstMediaData($cal, 'calendar_images');
            if ($media) {
                $data['image'] = $media;
            } elseif ($cal->calendar_image_url) {
                $data['image_url'] = $cal->calendar_image_url;
            }
            return $data;
        });

    return Inertia::render('AcademicCalendarPage', [
        'calendars' => $calendars
    ]);
})->name('akademik.kalender');

// Helper untuk mendapatkan data program studi
$getProgramData = function ($programName) {
    $imageService = new \App\Services\ImageService();
    $settings = ProgramStudiSetting::where('program_name', $programName)->with('media')->get()->keyBy('section_key');
    $pageData = [];
    foreach (array_keys(ProgramStudiSetting::getSectionFields()) as $key) {
        $dbRow = $settings->get($key);
        $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
        $content = ProgramStudiSetting::getContent($key, $dbContent);
        
        // Inject Media
        if ($dbRow) {
            if ($key === 'hero') {
                $media = $imageService->getFirstMediaData($dbRow, 'hero_bg');
                if ($media) $content['background_image'] = $media;
            }
            if ($key === 'facilities') {
                $media = $imageService->getFirstMediaData($dbRow, 'facilities_main_image');
                if ($media) $content['main_image'] = $media;

                // Inject images for facility items list
                if (isset($content['items']) && is_array($content['items'])) {
                    foreach ($content['items'] as $index => &$item) {
                        $itemMedia = $imageService->getFirstMediaData($dbRow, "facilities_item_{$index}_image");
                        if ($itemMedia) {
                            $item['image'] = $itemMedia['original_url'];
                        }
                    }
                }
            }
            if ($key === 'alumni_spotlight') {
                $media = $imageService->getFirstMediaData($dbRow, 'alumni_spotlight_image');
                if ($media) $content['image'] = $media;
            }
        }
        
        $pageData[$key] = $content;
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
    $imageService = new \App\Services\ImageService();
    
    $transformPosts = function ($posts) use ($imageService) {
        return $posts->map(function ($post) use ($imageService) {
            $data = $post->toArray();
            
            // Try to get media from 'featured' collection first
            $media = $imageService->getFirstMediaData($post, 'featured');
            
            // Fallback to 'gallery' collection if 'featured' is empty
            if (!$media) {
                $media = $imageService->getFirstMediaData($post, 'gallery');
            }
            
            if ($media) {
                $data['image'] = $media;
                $data['featured_image'] = $media['original_url'];
            } else {
                // Final fallback to database field
                $data['featured_image'] = $post->featured_image;
            }
            
            return $data;
        });
    };

    $posts = \App\Models\Post::with(['author', 'media'])
        ->where('status', 'published')
        ->where('published_at', '<=', now())
        ->latest('published_at')
        ->get();
    $posts = $transformPosts($posts);

    $popularPosts = \App\Models\Post::with(['author', 'media'])
        ->where('status', 'published')
        ->orderBy('views_count', 'desc')
        ->take(5)
        ->get();
    $popularPosts = $transformPosts($popularPosts);

    return Inertia::render('BeritaPengumumanPage', [
        'posts' => $posts,
        'popularPosts' => $popularPosts
    ]);
})->name('berita.pengumuman');

Route::get('/berita/{slug}', function ($slug) {
    $imageService = new \App\Services\ImageService();

    $post = \App\Models\Post::with(['author', 'media'])->where('slug', $slug)->firstOrFail();
    $post->increment('views_count');
    
    // Transform single post to include media
    $postData = $post->toArray();
    
    // Try featured collection first, fallback to gallery
    $media = $imageService->getFirstMediaData($post, 'featured');
    if (!$media) {
        $media = $imageService->getFirstMediaData($post, 'gallery');
    }
    
    if ($media) {
        $postData['featuredImage'] = $media;
        $postData['featured_image'] = $media['original_url'];
    } else {
        // Final fallback to database field
        $postData['featured_image'] = $post->featured_image;
    }
    
    // Get gallery images if exists (for carousel)
    $galleryMedia = $imageService->getAllMediaData($post, 'gallery');
    if (!empty($galleryMedia)) {
        $postData['galleryImages'] = $galleryMedia;
    }
    
    $relatedPosts = \App\Models\Post::where('id', '!=', $post->id)
        ->where('category', $post->category)
        ->where('status', 'published')
        ->latest('published_at')
        ->take(3)
        ->with(['author', 'media'])
        ->get()
        ->map(function ($p) use ($imageService) {
            $d = $p->toArray();
            
            // Try featured collection first, fallback to gallery
            $m = $imageService->getFirstMediaData($p, 'featured');
            if (!$m) {
                $m = $imageService->getFirstMediaData($p, 'gallery');
            }
            
            if ($m) {
                $d['featuredImage'] = $m;
                $d['featured_image'] = $m['original_url'];
            } else {
                $d['featured_image'] = $p->featured_image;
            }
            
            return $d;
        });

    return Inertia::render('BeritaDetailPage', [
        'post' => $postData,
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
    ->middleware('throttle:3,1')
    ->name('kontak.store');

// Route untuk galeri
Route::get('/galeri', function () {
    $imageService = new \App\Services\ImageService();
    $galleries = Gallery::with('media')->latest()->get()->map(function ($gallery) use ($imageService) {
        $data = $gallery->toArray();
        $media = $imageService->getFirstMediaData($gallery, 'images');
        if ($media) {
            $data['image'] = $media;
        }
        return $data;
    });
    
    return Inertia::render('GaleriPage', [
        'galleries' => $galleries
    ]);
})->name('galeri');

// Route untuk guru & staff
Route::get('/guru-staff', function () {
    $imageService = new \App\Services\ImageService();
    $teachers = \App\Models\Teacher::where('is_active', true)
        ->orderBy('sort_order')
        ->with('media')
        ->get()
        ->map(function ($teacher) use ($imageService) {
            $data = $teacher->toArray();
            
            // Get photo from media library
            $photoMedia = $imageService->getFirstMediaData($teacher, 'photos');
            if ($photoMedia) {
                $data['photosImage'] = $photoMedia;
                $data['image_url'] = $photoMedia['original_url'];
            }
            
            return $data;
        });
    
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
        ->middleware(['guest:admin', 'throttle:5,1'])
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
        Route::resource('alumni', \App\Http\Controllers\Admin\AlumniController::class)
             ->parameters(['alumni' => 'alumni']);
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

        Route::get('/extracurriculars', [\App\Http\Controllers\Admin\ExtracurricularController::class, 'index'])->name('extracurriculars.index');
        Route::post('/extracurriculars', [\App\Http\Controllers\Admin\ExtracurricularController::class, 'store'])->name('extracurriculars.store');
        Route::put('/extracurriculars/{extracurricular}', [\App\Http\Controllers\Admin\ExtracurricularController::class, 'update'])->name('extracurriculars.update');
        Route::delete('/extracurriculars/{extracurricular}', [\App\Http\Controllers\Admin\ExtracurricularController::class, 'destroy'])->name('extracurriculars.destroy');

        // RAG Documents Management
        Route::resource('rag-documents', \App\Http\Controllers\Admin\RagDocumentController::class);
        Route::post('/rag-documents/{ragDocument}/reprocess', [\App\Http\Controllers\Admin\RagDocumentController::class, 'reprocess'])->name('rag-documents.reprocess');

        // AI Settings Management
        Route::get('/ai-settings', [\App\Http\Controllers\Admin\AiSettingController::class, 'index'])->name('ai-settings.index');
        Route::post('/ai-settings', [\App\Http\Controllers\Admin\AiSettingController::class, 'update'])->name('ai-settings.update');
        Route::get('/ai-settings/models', [\App\Http\Controllers\Admin\AiSettingController::class, 'models'])->name('ai-settings.models');

        // Instagram Bot Management
        Route::get('/instagram-bots', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'index'])->name('instagram-bots.index');
        Route::post('/instagram-settings', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'updateSettings'])->name('instagram-settings.update');
        Route::post('/instagram-scraper/run', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'runScraper'])->name('instagram-scraper.run');
        Route::post('/instagram-scraper/single-post', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'scrapeSinglePost'])->name('instagram-scraper.single-post');
        Route::post('/instagram-posts/{id}/approve', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'approvePost'])->name('instagram-posts.approve');
        Route::post('/instagram-posts/{id}/process-ai', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'processWithAI'])->name('instagram-posts.process-ai');
        Route::post('/instagram-posts/{id}/reset-status', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'resetProcessingStatus'])->name('instagram-posts.reset-status');
        Route::delete('/instagram-posts/{id}/reject', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'rejectPost'])->name('instagram-posts.reject');
        Route::post('/instagram-posts/bulk-approve', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'bulkApprove'])->name('instagram-posts.bulk-approve');
        Route::post('/instagram-posts/cleanup-stuck', [\App\Http\Controllers\Admin\InstagramBotAccountController::class, 'cleanupStuckPosts'])->name('instagram-posts.cleanup-stuck');

        // PTN Admissions Management
        Route::get('/ptn-admissions', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'index'])->name('ptn-admissions.index');
        Route::post('/ptn-admissions/batches', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'storeBatch'])->name('ptn-admissions.batches.store');
        Route::put('/ptn-admissions/batches/{batch}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'updateBatch'])->name('ptn-admissions.batches.update');
        Route::delete('/ptn-admissions/batches/{batch}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'destroyBatch'])->name('ptn-admissions.batches.destroy');
        Route::get('/ptn-admissions/batches/{batch}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'showBatch'])->name('ptn-admissions.batches.show');
        Route::post('/ptn-admissions/batches/{batch}/admissions', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'storeAdmission'])->name('ptn-admissions.batches.admissions.store');
        Route::post('/ptn-admissions/batches/{batch}/bulk-import', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'bulkImport'])->name('ptn-admissions.batches.bulk-import');
        Route::post('/ptn-admissions/batches/{batch}/import-excel', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'importExcel'])->name('ptn-admissions.batches.import-excel');
        Route::get('/ptn-admissions/download-template', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'downloadTemplate'])->name('ptn-admissions.download-template');
        Route::put('/ptn-admissions/admissions/{admission}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'updateAdmission'])->name('ptn-admissions.admissions.update');
        Route::delete('/ptn-admissions/admissions/{admission}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'destroyAdmission'])->name('ptn-admissions.admissions.destroy');
        Route::post('/ptn-admissions/universities', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'storeUniversity'])->name('ptn-admissions.universities.store');
        Route::put('/ptn-admissions/universities/{university}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'updateUniversity'])->name('ptn-admissions.universities.update');
        Route::delete('/ptn-admissions/universities/{university}', [\App\Http\Controllers\Admin\PtnAdmissionController::class, 'destroyUniversity'])->name('ptn-admissions.universities.destroy');

        // TKA Averages Management
        Route::delete('/tka-averages/group', [\App\Http\Controllers\Admin\TkaAverageController::class, 'destroyGroup'])->name('tka-averages.group.destroy');
        Route::resource('tka-averages', \App\Http\Controllers\Admin\TkaAverageController::class);
    });
});
// --- AKHIR RUTE ADMIN ---

// --- API ROUTES FOR CHATBOT ---
Route::prefix('api')->name('api.')->group(function () {
    Route::post('/chat/send', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage'])
        ->middleware('throttle:20,1')
        ->name('chat.send');
    
    Route::get('/chat/history', [\App\Http\Controllers\Api\ChatController::class, 'getHistory'])
        ->name('chat.history');
});
// --- AKHIR API ROUTES ---

// --- INSTAGRAM SCRAPER IMAGES ROUTE ---
Route::get('/scraped-images/{path}', function ($path) {
    $fullPath = base_path('instagram-scraper/downloads/' . $path);
    
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    // Security: only allow image files
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
    
    if (!in_array($extension, $allowedExtensions)) {
        abort(403);
    }
    
    return response()->file($fullPath);
})->where('path', '.*')->name('scraped-images');
// --- AKHIR INSTAGRAM SCRAPER IMAGES ROUTE ---

// --- SEO ROUTES ---
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [\App\Http\Controllers\SitemapController::class, 'robots'])->name('robots');
// --- AKHIR SEO ROUTES ---

// --- HEALTH CHECK ROUTE ---
// Health check is already excluded from CSRF in bootstrap/app.php via except patterns
Route::get('/health', [\App\Http\Controllers\HealthController::class, 'index'])->name('health');
// --- AKHIR HEALTH CHECK ROUTE ---
