<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Instagram Scraper & AI News Generator Schedule
|--------------------------------------------------------------------------
|
| Automated workflow to scrape Instagram feeds and generate news articles:
| 1. Daily at 6 AM: Scrape Instagram for new posts
| 2. Daily at 7 AM: Process scraped feeds with AI to create draft articles
| 3. Hourly: Process any pending feeds (in case of failures)
|
*/

// Daily Instagram Scraping at 6:00 AM (Apify)
Schedule::command('instagram:scrape sman1baleendah --max-posts=10 --apify')
    ->dailyAt('06:00')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Illuminate\Support\Facades\Log::info('[Cron] Instagram scraping completed successfully');
    })
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('[Cron] Instagram scraping failed');
    });

// Daily AI Processing at 7:00 AM (1 hour after scraping)
Schedule::command('instagram:process --limit=10')
    ->dailyAt('07:00')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Illuminate\Support\Facades\Log::info('[Cron] Instagram feed processing completed');
    })
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('[Cron] Instagram feed processing failed');
    });

// Hourly processing for any pending feeds (backup/retry)
Schedule::command('instagram:process --limit=5')
    ->hourly()
    ->withoutOverlapping()
    ->when(function () {
        // Only run if there are pending feeds
        try {
            $pendingCount = \Illuminate\Support\Facades\DB::table('sc_raw_news_feeds')
                ->where('is_processed', false)
                ->whereNull('error_message')
                ->count();
            return $pendingCount > 0;
        } catch (\Exception $e) {
            return false;
        }
    });

// Weekly cleanup of old processed feeds (every Sunday at 2 AM)
Schedule::call(function () {
    try {
        $deleted = \Illuminate\Support\Facades\DB::table('sc_raw_news_feeds')
            ->where('is_processed', true)
            ->where('processed_at', '<', now()->subDays(30))
            ->delete();
        
        \Illuminate\Support\Facades\Log::info('[Cron] Cleaned up old Instagram feeds', ['deleted' => $deleted]);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('[Cron] Cleanup failed', ['error' => $e->getMessage()]);
    }
})->weeklyOn(0, '02:00'); // Sunday at 2 AM
