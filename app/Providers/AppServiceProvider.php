<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use App\Models\SiteSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);

        // Share site settings with all views (including app.blade.php) using cache
        try {
            if (!app()->runningInConsole() && Schema::hasTable('site_settings')) {
                View::share('siteSettings', SiteSetting::getCachedAll());
            }
        } catch (\Exception $e) {
            // Silently fail if DB is not ready (e.g. during build)
        }
    }
}
