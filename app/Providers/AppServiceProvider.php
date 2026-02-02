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
        // Enable method spoofing for legacy HTML forms and some XHR clients
        \Illuminate\Http\Request::enableHttpMethodParameterOverride();

        if ($this->app->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
            \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));
        }

        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);

        // Share site settings with all views using cache
        try {
            if (!app()->runningInConsole() && Schema::hasTable('site_settings')) {
                // Cache site settings for performance
                $settings = cache()->remember('site_settings_all', 3600, function () {
                    return SiteSetting::getCachedAll();
                });
                View::share('siteSettings', $settings);
            }
        } catch (\Exception $e) {
            // Silently fail if DB is not ready (e.g. during build)
        }
    }
}
