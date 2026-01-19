<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstagramBotAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InstagramBotAccountController extends Controller
{
    /**
     * Display Instagram bot accounts and scraper statistics
     */
    public function index()
    {
        $accounts = InstagramBotAccount::orderBy('created_at', 'desc')->get();

        // Get scraper statistics
        $stats = $this->getScraperStatistics();

        return Inertia::render('Admin/InstagramSettings/Index', [
            'accounts' => $accounts->map(function ($account) {
                return [
                    'id' => $account->id,
                    'username' => $account->username,
                    'masked_password' => $account->masked_password,
                    'is_active' => $account->is_active,
                    'is_configured' => $account->isConfigured(),
                    'last_used_at' => $account->last_used_at?->diffForHumans(),
                    'status_badge' => $account->status_badge,
                    'status_text' => $account->status_text,
                    'notes' => $account->notes,
                    'created_at' => $account->created_at->format('Y-m-d H:i'),
                ];
            }),
            'statistics' => $stats,
        ]);
    }

    /**
     * Store a new bot account
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-zA-Z0-9._]+$/', // Instagram username format
                Rule::unique('sc_bot_accounts', 'username'),
            ],
            'password' => 'required|string|min:6|max:255',
            'is_active' => 'boolean',
            'notes' => 'nullable|string|max:500',
        ], [
            'username.regex' => 'Username Instagram hanya boleh berisi huruf, angka, titik, dan underscore.',
            'username.unique' => 'Username ini sudah terdaftar.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $account = InstagramBotAccount::create([
                'username' => $request->username,
                'password' => $request->password,
                'is_active' => $request->boolean('is_active', true),
                'notes' => $request->notes,
            ]);

            Log::info('[InstagramBotAccount] New bot account created', [
                'account_id' => $account->id,
                'username' => $account->username,
                'admin_user' => Auth::id(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('success', 'Bot account berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('[InstagramBotAccount] Failed to create account', [
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('error', 'Gagal menambahkan bot account: ' . $e->getMessage());
        }
    }

    /**
     * Update bot account
     */
    public function update(Request $request, InstagramBotAccount $instagramBotAccount)
    {
        // Debug logging
        Log::info('[InstagramBotAccount] Update request received', [
            'account_id' => $instagramBotAccount->id,
            'current_username' => $instagramBotAccount->username,
            'request_data' => $request->all(),
        ]);

        $validator = Validator::make($request->all(), [
            'username' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-zA-Z0-9._]+$/',
                Rule::unique('sc_bot_accounts', 'username')->ignore($instagramBotAccount->id),
            ],
            'password' => 'nullable|string|min:6|max:255',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string|max:500',
        ], [
            'username.regex' => 'Username Instagram hanya boleh berisi huruf, angka, titik, dan underscore.',
        ]);

        if ($validator->fails()) {
            Log::warning('[InstagramBotAccount] Validation failed', [
                'errors' => $validator->errors()->toArray(),
            ]);
            return redirect()->route('admin.instagram-bots.index')
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $data = [
                'username' => $request->username,
                'is_active' => $request->boolean('is_active', false),
                'notes' => $request->notes,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $data['password'] = $request->password;
            }

            Log::info('[InstagramBotAccount] Updating with data', [
                'data' => $data,
                'password_changed' => $request->filled('password'),
            ]);

            $instagramBotAccount->update($data);

            // Verify update
            $instagramBotAccount->refresh();
            Log::info('[InstagramBotAccount] Account updated successfully', [
                'account_id' => $instagramBotAccount->id,
                'username' => $instagramBotAccount->username,
                'password_changed' => $request->filled('password'),
                'admin_user' => Auth::id(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('success', 'Bot account berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('[InstagramBotAccount] Failed to update account', [
                'account_id' => $instagramBotAccount->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('error', 'Gagal memperbarui bot account: ' . $e->getMessage());
        }
    }

    /**
     * Delete bot account
     */
    public function destroy(InstagramBotAccount $instagramBotAccount)
    {
        try {
            $username = $instagramBotAccount->username;
            $instagramBotAccount->delete();

            Log::info('[InstagramBotAccount] Account deleted', [
                'username' => $username,
                'admin_user' => Auth::id(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('success', 'Bot account berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('[InstagramBotAccount] Failed to delete account', [
                'account_id' => $instagramBotAccount->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('admin.instagram-bots.index')
                ->with('error', 'Gagal menghapus bot account: ' . $e->getMessage());
        }
    }

    /**
     * Test bot account connection (check session)
     */
    public function testConnection(InstagramBotAccount $instagramBotAccount)
    {
        try {
            $sessionFile = base_path('instagram-scraper/session-' . $instagramBotAccount->username);
            $hasSession = file_exists($sessionFile);

            return response()->json([
                'success' => true,
                'has_session' => $hasSession,
                'last_used' => $instagramBotAccount->last_used_at?->diffForHumans() ?? 'Never',
                'message' => $hasSession 
                    ? 'Session file tersedia. Bot siap digunakan.'
                    : 'Belum ada session. Login akan dilakukan saat scraping pertama kali.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get scraper statistics from database
     */
    protected function getScraperStatistics(): array
    {
        try {
            $stats = [
                'total_scraped' => DB::table('sc_raw_news_feeds')->count(),
                'pending_processing' => DB::table('sc_raw_news_feeds')->where('is_processed', false)->count(),
                'processed' => DB::table('sc_raw_news_feeds')->where('is_processed', true)->count(),
                'errors' => DB::table('sc_raw_news_feeds')->whereNotNull('error_message')->count(),
            ];

            // Get scraping activity by source
            $bySource = DB::table('sc_raw_news_feeds')
                ->select('source_username', DB::raw('COUNT(*) as count'))
                ->groupBy('source_username')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($item) => [
                    'username' => $item->source_username,
                    'count' => $item->count,
                ]);

            $stats['by_source'] = $bySource;

            // Get recent activity
            $recentActivity = DB::table('sc_raw_news_feeds')
                ->select('source_username', 'scraped_at', 'is_processed')
                ->orderBy('scraped_at', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($item) => [
                    'username' => $item->source_username,
                    'time' => \Carbon\Carbon::parse($item->scraped_at)->diffForHumans(),
                    'status' => $item->is_processed ? 'Processed' : 'Pending',
                ]);

            $stats['recent_activity'] = $recentActivity;

            return $stats;
        } catch (\Exception $e) {
            return [
                'total_scraped' => 0,
                'pending_processing' => 0,
                'processed' => 0,
                'errors' => 0,
                'by_source' => [],
                'recent_activity' => [],
            ];
        }
    }
}
