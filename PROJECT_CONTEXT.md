# SMAN 1 Baleendah - School Website Project Context

## Project Overview

This is a comprehensive school website for SMA Negeri 1 Baleendah (a senior high school in Bandung, West Java, Indonesia). The website serves as the official digital presence, providing information about academic programs, school activities, admissions, news, and more.

**Project Name:** SMAN 1 Baleendah Website  
**Technology Stack:** Laravel 12 + React 18 + Inertia.js  
**Database:** PostgreSQL (production), SQLite (development)  
**Deployment:** Docker (multi-stage Dockerfile with Nginx, PHP-FPM, PostgreSQL)

---

## Technology Stack

### Backend
- **Framework:** Laravel 12.0 (PHP 8.2+)
- **Authentication:** Laravel Sanctum for API authentication
- **Admin Auth:** Custom admin guard using `Admin` model
- **Database:** PostgreSQL 15 (production), SQLite (development)
- **Queue/Cache:** Database driver (Redis disabled for deployment)
- **Session:** Database driver
- **Security:** Custom SecurityHeaders middleware, trusted proxies (Cloudflare)
- **HTML Sanitization:** HTMLPurifier (ezyang/htmlpurifier)

### Frontend
- **Framework:** React 18.2.0
- **Bundler:** Vite 6.2.4
- **SSR/Styling:** TailwindCSS 3.2.1 + @tailwindcss/vite 4.0.0
- **Routing:** Inertia.js 2.0.0
- **UI Components:**
  - Headless UI React (@headlessui/react)
  - Radix UI (@radix-ui/react-navigation-menu)
  - Lucide React (icons)
  - Swiper 11.2.6 (carousels)
  - Chart.js 4.4.9 + react-chartjs-2.5.3.0
  - React Hot Toast (notifications)
  - Tailwind Animate
  - Tailwind Forms
  - Tailwind Typography
  - Tailwind Aspect Ratio

### Dev Tools
- **Testing:** PHPUnit 11.5.3
- **Code Quality:** Laravel Pint (PHP Pint)
- **Linting:** Laravel Pint
- **Development Sail:** Laravel Sail (Docker compose for local dev)
- **Queue Processing:** Laravel Queue Worker
- **Scheduler:** Laravel Task Scheduler

---

## Project Structure

```
smkweb/
├── app/
│   ├── Helpers/
│   │   ├── ActivityLogger.php      # Activity logging helper
│   │   └── HtmlSanitizer.php       # HTML sanitization for WYSIWYG content
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── Auth/
│   │   │   │   │   └── LoginController.php
│   │   │   │   ├── AcademicCalendarController.php
│   │   │   │   ├── ActivityLogController.php
│   │   │   │   ├── AlumniController.php
│   │   │   │   ├── CloudflareStatsController.php
│   │   │   │   ├── ContactMessageController.php
│   │   │   │   ├── CurriculumController.php
│   │   │   │   ├── ExtracurricularController.php
│   │   │   │   ├── FaqController.php
│   │   │   │   ├── GalleryController.php
│   │   │   │   ├── LandingPageContentController.php
│   │   │   │   ├── PostController.php
│   │   │   │   ├── ProgramController.php
│   │   │   │   ├── ProgramStudiController.php
│   │   │   │   ├── SchoolProfileController.php
│   │   │   │   ├── SiteSettingController.php
│   │   │   │   ├── SpmbContentController.php
│   │   │   │   └── TeacherController.php
│   │   │   ├── AcademicCalendarPublicController.php
│   │   │   ├── ContactController.php
│   │   │   └── Controller.php
│   │   └── Middleware/
│   │       ├── HandleInertiaRequests.php   # Shares data to Inertia props
│   │       └── SecurityHeaders.php          # CSP and security headers
│   ├── Models/
│   │   ├── AcademicCalendarContent.php
│   │   ├── ActivityLog.php
│   │   ├── Admin.php                        # Admin authentication model
│   │   ├── Alumni.php
│   │   ├── ContactMessage.php
│   │   ├── CurriculumSetting.php
│   │   ├── Extracurricular.php
│   │   ├── Faq.php
│   │   ├── Gallery.php
│   │   ├── LandingPageSetting.php           # Hero, About, CTA sections
│   │   ├── Post.php                         # News/Posts
│   │   ├── Program.php
│   │   ├── ProgramStudiSetting.php          # MIPA, IPS, Bahasa settings
│   │   ├── SchoolProfileSetting.php         # History, Vision/Mission
│   │   ├── SiteSetting.php                  # Site-wide settings
│   │   ├── SpmbSetting.php                  # Admission/PPDB settings
│   │   ├── Teacher.php
│   │   └── User.php
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   └── app.php                              # Laravel bootstrap config
├── config/
│   └── database.php                         # Database configuration
├── database/
│   ├── migrations/                          # Database migrations
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 2025_01_15_180000_create_spmb_settings_table.php
│   │   ├── 2025_05_09_074906_create_admins_table.php
│   │   ├── 2025_05_09_082432_create_activity_logs_table.php
│   │   ├── 2025_05_09_180032_create_landing_page_settings_table.php
│   │   ├── 2025_05_28_064349_create_academic_calendar_contents_table.php
│   │   ├── 2025_12_20_031306_create_programs_table.php
│   │   ├── 2025_12_20_031307_create_galleries_table.php
│   │   ├── 2025_12_20_092516_create_program_studi_settings_table.php
│   │   ├── 2025_12_20_123413_create_extracurriculars_table.php
│   │   ├── 2025_12_20_123413_create_posts_table.php
│   │   ├── 2025_12_20_123413_create_teachers_table.php
│   │   ├── 2025_12_20_125802_create_alumnis_table.php
│   │   ├── 2025_12_20_130148_create_faqs_table.php
│   │   ├── 2025_12_20_130321_create_school_profile_settings_table.php
│   │   ├── 2025_12_20_130619_create_curriculum_settings_table.php
│   │   ├── 2025_12_20_131726_create_site_settings_table.php
│   │   ├── 2025_12_20_132034_create_contact_messages_table.php
│   │   └── 2025_12_20_162927_add_is_active_to_academic_calendar_contents_table.php
│   └── seeders/
│       ├── AdminSeeder.php
│       ├── DatabaseSeeder.php
│       ├── GallerySeeder.php
│       ├── LandingPageSettingSeeder.php
│       ├── ProgramSeeder.php
│       └── SchoolRebrandingSeeder.php
├── docker/                                 # Docker configurations
│   ├── entrypoint.sh
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── sites/
│   │   └── ssl/
│   └── supervisor/
│       └── supervisord.conf
├── public/                                 # Public web root
├── resources/
│   ├── css/
│   │   └── app.css                         # Tailwind CSS entry
│   ├── js/
│   │   ├── app.jsx                         # React entry point
│   │   ├── bootstrap.js
│   │   ├── Components/
│   │   │   ├── Academic/
│   │   │   │   ├── AcademicHero.jsx
│   │   │   │   └── CallToAction.jsx
│   │   │   ├── Admin/                      # Admin UI components
│   │   │   ├── ui/                         # Shared UI components
│   │   │   ├── ApplicationLogo.jsx
│   │   │   ├── ChatWidget.jsx              # Chat support widget
│   │   │   ├── Checkbox.jsx
│   │   │   ├── DangerButton.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── InputError.jsx
│   │   │   ├── InputLabel.jsx
│   │   │   ├── MiniTextEditor.jsx          # Simple WYSIWYG editor
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavLink.jsx
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── ProgramStudiModal.jsx
│   │   │   ├── ResponsiveNavLink.jsx
│   │   │   ├── SecondaryButton.jsx
│   │   │   └── TextInput.jsx
│   │   ├── Hooks/
│   │   │   └── useContentManagement.js     # Content management hook
│   │   ├── Layouts/
│   │   │   ├── AdminLayout.jsx             # Admin layout wrapper
│   │   │   └── AuthenticatedLayout.jsx
│   │   ├── Pages/
│   │   │   ├── Admin/                      # Admin pages
│   │   │   │   ├── AcademicCalendarContentPage.jsx
│   │   │   │   ├── DashboardPage.jsx       # Admin dashboard with charts
│   │   │   │   ├── LandingPageContentPage.jsx
│   │   │   │   ├── SpmbContentPage.jsx
│   │   │   │   ├── Alumni/
│   │   │   │   ├── ContactMessages/
│   │   │   │   ├── Curriculum/
│   │   │   │   ├── Extracurriculars/
│   │   │   │   ├── Faqs/
│   │   │   │   ├── Galleries/
│   │   │   │   ├── Posts/
│   │   │   │   ├── Programs/
│   │   │   │   ├── ProgramStudi/
│   │   │   │   ├── SchoolProfile/
│   │   │   │   ├── SiteSettings/
│   │   │   │   └── Teachers/
│   │   │   ├── AcademicCalendarPage.jsx
│   │   │   ├── AlumniPage.jsx
│   │   │   ├── BeritaDetailPage.jsx        # News detail page
│   │   │   ├── BeritaPengumumanPage.jsx    # News listing page
│   │   │   ├── EkstrakurikulerPage.jsx
│   │   │   ├── GaleriPage.jsx
│   │   │   ├── GuruStaffPage.jsx
│   │   │   ├── InformasiSpmbPage.jsx       # Admission information
│   │   │   ├── KontakPage.jsx              # Contact form + FAQs
│   │   │   ├── KurikulumPage.jsx
│   │   │   ├── LandingPage.jsx             # Home page
│   │   │   ├── ProfilSekolahPage.jsx       # School profile & history
│   │   │   ├── ProgramBahasaPage.jsx
│   │   │   ├── ProgramIpsPage.jsx
│   │   │   ├── ProgramMipaPage.jsx
│   │   │   ├── ProgramSekolahPage.jsx
│   │   │   ├── StrukturOrganisasiPage.jsx
│   │   │   └── VisiMisiPage.jsx
│   │   └── Utils/
│   │       ├── academicData.js             # Academic program data
│   │       ├── galleryData.js              # Gallery mock data
│   │       ├── navigationData.js           # Navigation links & social media
│   │       ├── teacherData.js              # Teacher/staff mock data
│   │       └── typography.js               # Typography utilities
│   └── views/
│       └── app.blade.php                   # Blade root view for Inertia
├── routes/
│   └── web.php                             # All web routes
├── tests/
│   ├── Feature/
│   │   └── ContactFormTest.php
│   ├── Unit/
│   └── TestCase.php
├── vendor/                                 # Composer dependencies
├── .env.example                            # Environment template
├── .env.production                         # Production environment
├── .env.testing                            # Testing environment
├── .gitignore
├── composer.json                           # PHP dependencies
├── compose.sh                              # Docker compose management script
├── docker-compose.yml                      # Docker services configuration
├── docker-manage.sh                        # Docker helper scripts
├── Dockerfile                              # Multi-stage Dockerfile
├── deploy.ps1                              # PowerShell deployment script
├── deploy.sh                               # Linux/Mac deployment script
├── jsconfig.json                           # JavaScript project config
├── package.json                            # npm dependencies
├── phpunit.xml                             # PHPUnit configuration
├── postcss.config.js                       # PostCSS config for Tailwind
├── tailwind.config.js                      # Tailwind CSS configuration
└── vite.config.js                          # Vite bundler config
```

---

## Database Schema

### Core Tables

#### users (Not currently used, reserved for future use)
- id
- name
- email
- email_verified_at
- password
- remember_token
- timestamps

#### admins
- id
- username
- password
- remember_token
- timestamps
- **Relationships:** N/A (Authentication guard)

#### activity_logs
- id
- admin_id
- action
- model_type
- model_id
- description
- old_values (JSON)
- new_values (JSON)
- ip_address
- user_agent
- timestamps
- **Relationships:** belongsTo Admin

#### academic_calendar_contents
- id
- title
- content (JSON)
- is_active (boolean)
- sort_order
- display_date
- created_at
- updated_at
- **用途存储学术日历条目, 可启用/禁用特定条目**

#### alumni
- id
- name
- year
- achievement
- image_url
- sort_order
- is_published
- timestamps

#### contact_messages
- id
- name
- email
- subject
- message
- is_read
- timestamps

#### curriculum_settings
- id
- section_key
- content (JSON)
- timestamps
- **Sections:** hero_kurikulum, overview, subjects_by_program, teaching_methods

#### extracurriculars
- id
- name
- category (Olahraga/Seni/Akademik/Organisasi/Teknologi/Masyarakat)
- icon_name
- image_url
- description
- meeting_schedule
- is_active
- sort_order
- timestamps

#### faqs
- id
- question
- answer (TEXT/JSON sanitized HTML)
- category
- sort_order
- is_published
- timestamps

#### galleries
- id
- title
- description
- url
- category
- is_featured
- sort_order
- timestamps

#### landing_page_settings
- id
- section_key
- content (JSON)
- timestamps
- **Sections:**
  - hero (title_line1, title_line2, hero_text, background_image_url, student_image_url, stats)
  - about_lp (title, description_html, image_url)
  - kepsek_welcome_lp (title, kepsek_name, kepsek_title, kepsek_image_url, welcome_text_html)
  - programs_lp (title, description, items[...])
  - gallery_lp (title, description, images[...])
  - cta_lp (title, description)
  - kalender_akademik (title, description, calendar_image_url)

#### posts
- id
- title
- slug
- excerpt
- content
- featured_image
- category
- status (draft/published)
- author_id
- published_at
- is_featured
- views_count
- timestamps
- **Relationships:** belongsTo Admin (author)

#### programs
- id
- title
- category (Program Studi/Fasilitas/Prestasi)
- icon_name
- image_url
- color_class
- description
- link
- is_featured
- sort_order
- timestamps

#### program_studi_settings
- id
- program_name (mipa/ips/bahasa)
- section_key
- content (JSON)
- timestamps
- **Sections per program:** hero, overview, curriculum, achievements, teachers

#### school_profile_settings
- id
- section_key
- content (JSON)
- timestamps
- **Sections:**
  - hero_history (title, description, stats)
  - history (description_html, timeline[...])
  - hero_vision_mission (title, description)
  - vision_mission (vision_html, mission_html, values[...])
  - hero_organization (title, description)
  - organization (description_html, org_chart_url)
  - facilities (title, description, facilities[...])

#### site_settings
- id
- section_key
- content (JSON)
- timestamps
- **Sections:**
  - general (site_name, site_logo, address, phone, email, google_maps_embed_url)
  - social_media (facebook, instagram, twitter, linkedin, youtube)
  - seo (meta_title, meta_description, meta_keywords)
  - maintenance (is_maintenance_mode, maintenance_message)

#### spmb_settings
- id
- section_key
- content (JSON)
- timestamps
- **Sections:**
  - hero_spmb (title, description, registration_link)
  - pengaturan_umum (title, description_html, contact_info)
  - persyaratan (title, introduction, items[...], additional_notes)
  - prosedur (title, introduction, steps[...], contact_info)
  - jadwal (title, introduction, schedules[...])
  - biaya (title, introduction, items[...])
  - faq (title, introduction, items[...])

#### teachers
- id
- name
- nip
- subject
- position
- education
- image_url
- phone
- email
- is_active
- sort_order
- timestamps

---

## Routes Structure

### Public Routes
- `GET /` - Landing Page (Home)
- `GET /informasi-spmb` - Admission/PPDB Information
- `GET /alumni` - Alumni showcase
- `GET /profil-sekolah` - School Profile & History
- `GET /visi-misi` - Vision & Mission
- `GET /struktur-organisasi` - Organization Structure
- `GET /program` - Programs overview
- `GET /kalender-akademik` - Academic Calendar
- `GET /akademik/kurikulum` - Curriculum
- `GET /akademik/ekstrakurikuler` - Extracurriculars
- `GET /akademik/program-studi/mipa` - MIPA Program
- `GET /akademik/program-studi/ips` - IPS Program
- `GET /akademik/program-studi/bahasa` - Bahasa Program
- `GET /berita-pengumuman` - News/Announcements listing
- `GET /berita/{slug}` - News detail
- `GET /kontak` - Contact form + FAQs
- `POST /kontak` - Submit contact message (throttled: 5/min)
- `GET /galeri` - Gallery page
- `GET /guru-staff` - Teachers & Staff

### Admin Routes (`/admin/*`)
- **Authentication:**
  - `GET /admin/login` - Login form
  - `POST /admin/login` - Process login (throttled: 10/min)
  - `POST /admin/logout` - Logout

- **Dashboard:**
  - `GET /admin/dashboard` - Admin dashboard with stats, charts

- **Content Management:**
  - `GET /admin/landing-page-content` - Landing page content editor
  - `POST /admin/landing-page-content/update-all` - Update landing page
  - `GET /admin/spmb-content` - SPMB content editor
  - `PUT /admin/spmb-content/update-all` - Update SPMB content
  - `GET /admin/kurikulum` - Curriculum content editor
  - `POST /admin/kurikulum` - Update curriculum
  - `GET /admin/school-profile` - School profile editor
  - `POST /admin/school-profile` - Update school profile
  - `GET /admin/site-settings` - Site settings editor
  - `POST /admin/site-settings` - Update site settings
  - `GET /admin/program-studi` - Program studi content editor
  - `POST /admin/program-studi/update-all` - Update program studi

- **CRUD Resources:**
  - `Resource /admin/academic-calendar` - Academic calendar entries
  - `Resource /admin/programs` - Programs
  - `Resource /admin/galleries` - Gallery images
  - `Resource /admin/teachers` - Teachers & Staff
  - `Resource /admin/posts` - News/Posts
  - `Resource /admin/alumni` - Alumni
  - `Resource /admin/faqs` - FAQs
  - `Resource /admin/extracurriculars` - Extracurriculars

- **Contact Messages:**
  - `GET /admin/contact-messages` - List messages
  - `GET /admin/contact-messages/{id}` - View message
  - `DELETE /admin/contact-messages/{id}` - Delete message

- **API Endpoints:**
  - `GET /admin/api/activity-logs` - Activity logs
  - `GET /admin/api/cloudflare-stats` - Cloudflare unique visitors
  - `GET /admin/api/cloudflare-chart-stats` - Cloudflare stats for charts

---

## Key Features

### 1. Landing Page Management
- Dynamic hero section with statistics
- About section with rich HTML content
- Principal's welcome message
- Featured programs showcase
- Gallery preview
- Call-to-action for SPMB registration
- Latest posts/news integration

### 2. Academic Programs
- **MIPA (Math & Science):** Detailed curriculum, subjects, achievements
- **IPS (Social Sciences):** Social studies curriculum, achievements
- **Bahasa (Language):** Language program details, achievements
- Extracurricular activities with categories
- Academic calendar management
- Curriculum overview

### 3. Content Management System
- WYSIWYG editor with HTML sanitization (HTMLPurifier)
- Support for rich HTML content in descriptions
- Image uploads for galleries, teachers, alumni
- Sort order management for lists
- Draft/published status for posts

### 4. News/Blog System
- Post creation with rich content
- Featured posts
- Category support
- View counter
- Author tracking
- Related posts

### 5. School Profile
- History with timeline
- Vision & Mission with values
- Organization structure
- Facilities showcase
- Teacher & Staff directory

### 6. Admission (SPMB) Information
- Requirements list
- Registration procedures
- Schedule information
- Fee information
- FAQ section

### 7. Contact System
- Contact form with validation
- Rate limiting (5/minute)
- FAQ management
- Admin message management

### 8. Admin Dashboard
- Statistics overview
- Cloudflare analytics integration
- Activity logging
- Chart.js visualization
- Contact message notifications

### 9. Security Features
- Authentication for admin panel
- CSRF protection
- XSS protection via HTMLPurifier
- Rate limiting on sensitive routes
- Trust proxies for Cloudflare
- Security headers middleware
- CSP (Content Security Policy)
- SQL injection protection (Eloquent ORM)

### 10. SEO & Accessibility
- Meta tags management
- Social media integration
- Responsive design
- Semantic HTML
- Accessible navigation

---

## Design System

### Color Palette
```css
--primary: #0D47A1;           /* Deep Blue (Brand) */
--primary-darker: #0a367a;    /* Darker shade for hover */
--secondary: #F5F7FA;         /* Light Grey (Backgrounds) */
--accent-yellow: #FFC107;     /* Golden Yellow (CTA/Highlights) */
```

### Typography
- **Sans:** Plus Jakarta Sans (default)
- **Serif:** Merriweather (headings)

### Animations
- `float-slow` - 6s floating animation
- `float-medium` - 5s floating animation
- `float-fast` - 4s floating animation
- `fade-in-up` - 0.8s fade in from bottom

### Components
- Primary/Secondary/Danger buttons
- Modal dialogs
- Dropdown menus
- Text inputs with labels
- Checkboxes
- Navigation links
- Responsive navigation
- Chat widget
- Mini text editor
- Card components
- Gallery grid

---

## Docker Architecture

### Services
1. **app** - PHP-FPM 8.2 application container
2. **nginx** - Nginx web server serving static assets
3. **db** - PostgreSQL 15 database
4. **queue** - Laravel queue worker
5. **scheduler** - Laravel task scheduler

### Dockerfile Highlights
- Multi-stage build (Node for frontend, PHP-FPM for backend)
- Optimized for production
- Supervisor process management
- Shared volumes for assets
- Health checks for database

### Volumes
- `postgres_data` - PostgreSQL data persistence
- `app_public` - Shared public assets between app and nginx

### Networks
- `sman1-network` - Bridge network for service communication

---

## Environment Configuration

### Development
- Database: SQLite
- APP_ENV: local
- Debug: true

### Production
- Database: PostgreSQL
- Cache: file
- Session: database
- Queue: database

### Testing
- Database: SQLite (in-memory)
- APP_ENV: testing
- Cache: array
- Session: array
- Queue: sync

---

## Key Models & Relationships

### Admin
- Authentication model for admin panel
- Uses Laravel's Authenticatable
- Hashed passwords

### Post
- `belongsTo Admin (author)`
- Published status management
- View counting

### Program
- Featured flag
- Sort order
- Multiple categories

### Gallery
- Featured flag
- Sort order

### *Setting Models (*Setting classes)
These use JSON content columns with section keys:
- `LandingPageSetting`
- `SpmbSetting`
- `ProgramStudiSetting`
- `SchoolProfileSetting`
- `CurriculumSetting`
- `SiteSetting`

Each has:
- `getSectionFields()` - Defines valid fields per section
- `getDefaults($sectionKey)` - Provides default content
- `getContent($sectionKey, $dbContent)` - Merges with defaults

---

## API/Controller Patterns

### ContentController Pattern
- Index: Fetch content by section
- storeOrUpdate: Update all sections at once
- Uses section-based JSON content

### Resource Controller Pattern
- Standard CRUD operations
- Index, Store, Show, Update, Destroy
- Additional custom actions (set-active, etc.)

---

## Frontend Patterns

### Page Components
- Inertia pages in `resources/js/Pages/`
- Receive props from Laravel controllers
- Use shared layouts (AdminLayout, AuthenticatedLayout)

### Hooks
- `useContentManagement()` - Content editing state management

### Utils
- `navigationData.js` - Central navigation configuration
- `academicData.js` - Academic program data
- `galleryData.js` - Gallery mock data
- `teacherData.js` - Teacher mock data
- `typography.js` - Typography utilities

### Shared Props (via HandleInertiaRequests)
- auth.user / auth.admin
- siteSettings
- flash (success/error messages)

---

## Testing

### Feature Tests
- `ContactFormTest.php` - Contact form validation and submission

### Test Configuration
- PHPUnit 11.5.3
- SQLite in-memory database
- Array cache/session drivers
- Environment: testing

---

## Development Commands

### Composer Scripts
```bash
composer dev          # Run serve, queue, logs, and npm run dev (concurrently)
composer test         # Run tests
```

### npm Scripts
```bash
npm run dev           # Run Vite dev server
npm run build         # Build for production
```

### Artisan Commands
```bash
php artisan serve                    # Development server
php artisan queue:work               # Process queue
php artisan schedule:run             # Run scheduled tasks
php artisan migrate                  # Run migrations
php artisan db:seed                  # Run seeders
php artisan storage:link             # Link storage
```

### Docker Commands
```bash
docker-compose up -d                 # Start services
docker-compose down                  # Stop services
docker-compose logs -f app           # View app logs
```

---

## Security Considerations

1. **HTML Sanitization:** All HTML content sanitized via HTMLPurifier
2. **Authentication:** Admin panel protected with auth guard
3. **Rate Limiting:** Login (10/min), Contact form (5/min)
4. **CSRF Protection:** All forms protected
5. **SQL Injection:** Eloquent ORM prevents attacks
6. **XSS Protection:** HTMLPurifier sanitizes user input
7. **Security Headers:** CSP, X-Frame-Options, X-Content-Type-Options
8. **Trust Proxies:** Cloudflare support
9. **Hashed Passwords:** Bcrypt with 12 rounds
10. **Trusted Hosts:** Host validation

---

## Deployment

### Docker Deployment
1. Build multi-stage Dockerfile
2. Deploy with docker-compose
3. Nginx serves static assets
4. PHP-FPM handles dynamic requests
5. PostgreSQL for database
6. Queue worker for background jobs
7. Scheduler for scheduled tasks

### Deployment Scripts
- `deploy.sh` - Linux/Mac deployment
- `deploy.ps1` - Windows PowerShell deployment

---

## Known Issues & Notes

1. **Redis Disabled:** Using database driver for cache/queue/session
2. **Local vs Production CSP:** CSP disabled in local dev for Vite
3. **Image Versioning:** LandingPage uses image versioning in URL
4. **Default Content:** All setting models provide defaults via static methods
5. **Mock Data:** Some pages use mock data files (academicData, galleryData, teacherData)

---

## Future Enhancements

- Redis integration for caching
- Elasticsearch for search
- Multi-language support (Indonesian/English)
- Student portal integration
- Online registration system
- Live streaming integration
- Mobile app
- Analytics dashboard
