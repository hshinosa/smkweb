# Development Guidelines

Panduan development untuk SMK Website yang lebih fleksibel namun tetap maintainable.

## 🎯 Core Principles

### 1. **Pragmatic Over Perfect**
- ✅ **DO:** Ship working features quickly, iterate later
- ✅ **DO:** Use established patterns in the codebase
- ❌ **DON'T:** Over-engineer for hypothetical future needs
- ❌ **DON'T:** Refactor working code without clear benefit

### 2. **User Experience First**
- ✅ **DO:** Prioritize page load speed and responsiveness
- ✅ **DO:** Test on mobile devices (majority of users)
- ✅ **DO:** Optimize images before uploading
- ❌ **DON'T:** Add features that slow down the site
- ❌ **DON'T:** Assume users have fast internet

### 3. **Convention Over Configuration**
- ✅ **DO:** Follow Laravel and React conventions
- ✅ **DO:** Use existing components when possible
- ✅ **DO:** Copy patterns from similar existing features
- ❌ **DON'T:** Create new patterns for every feature
- ❌ **DON'T:** Fight the framework

---

## 📁 Project Structure

```
smkweb/
├── app/
│   ├── Http/Controllers/      # API & page controllers
│   ├── Models/                # Eloquent models (use HasMedia for images)
│   └── Services/              # Business logic (OpenAI, RAG, etc)
├── resources/
│   ├── js/
│   │   ├── Components/        # Reusable React components
│   │   │   ├── ResponsiveImage.jsx   # Use this for all images!
│   │   │   ├── ChatWidget.jsx
│   │   │   └── SEOHead.jsx
│   │   ├── Pages/             # Inertia pages
│   │   └── Utils/             # Helper functions & data
│   └── views/
│       └── app.blade.php      # Main layout
├── routes/
│   └── web.php                # All routes here
└── database/
    └── migrations/            # Database schema
```

---

## 🖼️ Image Handling

### **For User-Uploaded Images** (Admin Panel)

**Use Spatie Media Library:**

```php
// Controller
public function store(Request $request)
{
    $post = Post::create($request->all());
    
    // Upload image - auto-generates WebP + responsive sizes
    if ($request->hasFile('image')) {
        $post->addMediaFromRequest('image')
             ->toMediaCollection('featured');
    }
}

// Get image URLs
$post = Post::with('media')->first();
$media = $post->getFirstMedia('featured');

// Pass to React
return Inertia::render('PostDetail', [
    'post' => $post,
    'featuredImage' => $media ? [
        'original_url' => $media->getUrl(),
        'conversions' => [
            'mobile' => $media->getUrl('mobile'),
            'tablet' => $media->getUrl('tablet'),
            'desktop' => $media->getUrl('desktop'),
            'webp' => $media->getUrl('webp'),
            'thumb' => $media->getUrl('thumb'),
        ]
    ] : null,
]);
```

**In React:**

```jsx
import { HeroImage, ContentImage } from '@/Components/ResponsiveImage';

// Hero/Banner images
<HeroImage 
    media={featuredImage} 
    alt="Post title"
/>

// Content images
<ContentImage 
    media={featuredImage}
    alt="Description"
/>
```

**What happens:**
1. Admin uploads 1 image (JPEG/PNG)
2. Server auto-generates:
   - `mobile.webp` (375px)
   - `tablet.webp` (768px)
   - `desktop.webp` (1280px)
   - `large.webp` (1920px)
   - `webp` (original size)
   - `thumb.webp` (200x200)
3. React automatically serves optimal size per device
4. **Savings: 70-95% bandwidth!**

---

### **For Static Images** (Developer/Designer provided)

**Option 1: Manual (Quick):**
1. Place image in `public/images/`
2. Convert to WebP manually (use squoosh.app)
3. Create 2-3 sizes: `hero-375.webp`, `hero-1920.webp`
4. Use ResponsiveImage component

**Option 2: Automated (Future):**
- Vite plugin will auto-generate on build
- Just put `hero.jpg` in `public/images/`
- Build creates all variants automatically

---

## ⚡ Performance Best Practices

### **Images**
- ✅ Use `<HeroImage>` for above-fold images
- ✅ Use `<ContentImage>` for article images
- ✅ Use `<GalleryImage>` for gallery grids
- ✅ Always provide `alt` text
- ❌ Never use raw `<img>` tags for large images
- ❌ Never upload unoptimized images (>500KB)

### **CSS**
- ✅ Use Tailwind utility classes
- ✅ Keep custom CSS minimal
- ❌ Don't add unused CSS libraries
- ❌ Don't fight Tailwind with custom styles

### **JavaScript**
- ✅ Use React hooks (useState, useEffect, useMemo)
- ✅ Lazy load heavy components if needed
- ❌ Don't add heavy npm packages without review
- ❌ Don't leave console.log in production code

---

## 🔒 Security

### **User Input**
- ✅ **ALWAYS** validate and sanitize user input
- ✅ Use Laravel validation rules
- ✅ Sanitize HTML content (use DOMPurify in React)
- ❌ **NEVER** trust user input
- ❌ **NEVER** execute user-provided code

### **File Uploads**
- ✅ Validate file types (JPEG, PNG, WebP only)
- ✅ Limit file size (max 5MB)
- ✅ Store uploads outside public directory
- ✅ Use Spatie Media Library (built-in security)
- ❌ Don't allow executable files (.php, .js, .exe)
- ❌ Don't trust MIME types alone

### **API Keys**
- ✅ Store in `.env` file
- ✅ Never commit `.env` to git
- ✅ Use Laravel config() helper
- ❌ **NEVER** hardcode API keys
- ❌ **NEVER** expose keys to frontend

---

## 🧪 Testing

### **Before Committing:**
```bash
# Run these checks
npm run build              # Check frontend builds
php artisan migrate:fresh  # Test migrations (dev only!)
php artisan test           # Run PHPUnit tests
```

### **Before Deploying:**
- ✅ Test on mobile device
- ✅ Test chatbot functionality
- ✅ Check image uploads work
- ✅ Verify no console errors
- ✅ Test on slow 3G network

---

## 🚀 Deployment

### **Build Process:**
```bash
# 1. Install dependencies
composer install --optimize-autoloader --no-dev
npm ci

# 2. Build assets
npm run build

# 3. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Run migrations
php artisan migrate --force

# 5. Clear application cache
php artisan cache:clear
```

### **Environment:**
- ✅ Set `APP_ENV=production`
- ✅ Set `APP_DEBUG=false`
- ✅ Use strong `APP_KEY`
- ✅ Configure database properly
- ❌ Never use SQLite in production
- ❌ Never enable debug mode in production

---

## 🛠️ Common Tasks

### **Add New Page:**
1. Create route in `routes/web.php`
2. Create controller method
3. Create React page in `resources/js/Pages/`
4. Add to navigation in `navigationData.js`
5. Add SEO metadata using `<SEOHead>`

### **Add New Feature:**
1. Check if similar feature exists
2. Copy and modify existing code
3. Follow naming conventions
4. Test locally
5. Commit with clear message

### **Fix Bug:**
1. Reproduce bug locally
2. Check Laravel logs (`storage/logs/`)
3. Check browser console
4. Fix and test
5. Commit with "fix: " prefix

---

## 📝 Code Style

### **PHP (Laravel):**
- Follow PSR-12 standards
- Use type hints
- Write docblocks for public methods
- Keep controllers thin, use services for logic

```php
// Good ✅
public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'title' => 'required|max:255',
        'content' => 'required',
    ]);

    $post = $this->postService->create($validated);

    return redirect()->route('posts.show', $post);
}

// Bad ❌
public function store($request)
{
    $post = new Post;
    $post->title = $request->title;
    $post->content = $request->content;
    $post->save();
    return redirect('/posts/' . $post->id);
}
```

### **JavaScript (React):**
- Use functional components with hooks
- Destructure props
- Use meaningful variable names
- Keep components small and focused

```jsx
// Good ✅
export default function PostCard({ title, excerpt, image, author }) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <article className="bg-white rounded-lg shadow-md">
            <HeroImage media={image} alt={title} />
            <h2>{title}</h2>
            <p>{excerpt}</p>
        </article>
    );
}

// Bad ❌
export default function PostCard(props) {
    var liked = false;
    return (
        <div className="bg-white rounded-lg shadow-md">
            <img src={props.image} />
            <h2>{props.title}</h2>
        </div>
    );
}
```

---

## 🤝 Git Workflow

### **Commit Messages:**
```
feat: Add gallery masonry layout
fix: Resolve chatbot empty response issue
perf: Optimize image loading with WebP
docs: Update installation instructions
refactor: Extract image logic to service
```

### **Before Pushing:**
```bash
# Check what's changed
git status
git diff

# Review ALL changes
git diff --cached

# Look for accidentally committed secrets
git diff --cached | grep -i "api_key\|password\|secret"
```

---

## 🎨 Design System

### **Colors:**
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)

### **Typography:**
- Headers: Plus Jakarta Sans
- Body: Merriweather
- Code: Mono

### **Spacing:**
- Use Tailwind spacing scale (4px base)
- Container: max-w-7xl mx-auto px-4

### **Components:**
- Always use existing components first
- Check `resources/js/Components/` before creating new
- Match existing design patterns

---

## 📚 Resources

### **Documentation:**
- [Laravel Docs](https://laravel.com/docs)
- [React Docs](https://react.dev)
- [Inertia.js](https://inertiajs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Spatie Media Library](https://spatie.be/docs/laravel-medialibrary)

### **Tools:**
- [Squoosh](https://squoosh.app) - Image optimization
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance testing
- [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar) - Development debugging

---

## ⚠️ Common Pitfalls

### **1. N+1 Queries**
```php
// Bad ❌
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;  // Queries author for each post!
}

// Good ✅
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name;  // Pre-loaded
}
```

### **2. Mass Assignment**
```php
// Bad ❌
Post::create($request->all());  // Dangerous!

// Good ✅
$validated = $request->validate([...]);
Post::create($validated);
```

### **3. Image Optimization**
```jsx
// Bad ❌
<img src="/images/hero-original.jpg" />  // 5MB image!

// Good ✅
<HeroImage src="/images/hero.jpg" alt="Hero" />  // Auto-optimized
```

### **4. Memory Leaks**
```jsx
// Bad ❌
useEffect(() => {
    const interval = setInterval(() => {...}, 1000);
    // No cleanup!
});

// Good ✅
useEffect(() => {
    const interval = setInterval(() => {...}, 1000);
    return () => clearInterval(interval);  // Cleanup
}, []);
```

---

## 🎓 Learning Path

### **For New Developers:**

1. **Week 1:** Understand Laravel basics
   - Routing, controllers, models
   - Blade templates
   - Database migrations

2. **Week 2:** Learn React fundamentals
   - Components, props, state
   - Hooks (useState, useEffect)
   - JSX syntax

3. **Week 3:** Master Inertia.js
   - How pages work
   - Passing data from Laravel to React
   - Forms and validation

4. **Week 4:** Project-specific patterns
   - Image handling with Spatie
   - SEO with SEOHead component
   - Navigation structure

---

## 💡 Pro Tips

1. **Use Browser DevTools:**
   - Network tab for performance
   - Console for errors
   - Lighthouse for audits

2. **Read Error Messages:**
   - Laravel errors are very descriptive
   - React errors point to exact line
   - Don't ignore warnings

3. **Copy Before Create:**
   - Find similar feature
   - Copy and modify
   - Understand before changing

4. **Test Locally First:**
   - Never push untested code
   - Use Docker for consistent environment
   - Test on mobile viewport

5. **Ask for Help:**
   - Check documentation first
   - Search GitHub issues
   - Ask specific questions

---

## 🔄 Changelog

### **2025-12-29: Performance Optimization**
- ✅ Added Spatie Media Library for automatic WebP conversion
- ✅ Created ResponsiveImage component with presets
- ✅ Implemented lazy loading for all images
- ✅ Added font optimization (dns-prefetch, font-display)
- ✅ Configured aggressive caching (1 year for static assets)
- ✅ Added width/height to prevent CLS

**Impact:** 
- 70-95% bandwidth reduction
- +10-15 points Lighthouse performance score
- ~1-2s faster page loads

---

## 📞 Support

**Issues?**
1. Check `storage/logs/laravel.log`
2. Check browser console (F12)
3. Review recent changes with `git log`
4. Test in incognito mode (cache issues)

**Need Help?**
- Documentation: `README.md`
- Laravel errors: `storage/logs/`
- Performance: Run Lighthouse audit
- Database: Check migrations

---

**Remember:** Perfect is the enemy of good. Ship working features, iterate quickly, and always prioritize user experience over technical perfection.
