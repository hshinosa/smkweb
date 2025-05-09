<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Gunakan Laravel HTTP Client

class CloudflareStatsController extends Controller
{
    public function getUniqueVisitors(Request $request)
    {
        $apiKey = env('CLOUDFLARE_API_KEY');
        $email = env('CLOUDFLARE_EMAIL');
        $zoneId = env('CLOUDFLARE_ZONE_ID');

        // Tentukan rentang tanggal (misal, 30 hari terakhir)
        // Cloudflare API menggunakan format RFC3339
        $since = now()->subDays(30)->toRfc3339String();
        $until = now()->toRfc3339String();

        $apiUrl = "https://api.cloudflare.com/client/v4/zones/{$zoneId}/analytics/dashboard?since={$since}&until={$until}&metrics=uniques";

        try {
            $response = Http::withHeaders([
                'X-Auth-Email' => $email,
                'X-Auth-Key' => $apiKey,
                'Content-Type' => 'application/json',
            ])->get($apiUrl);

            if ($response->successful()) {
                $data = $response->json();
                // Sesuaikan path data berdasarkan respons API Cloudflare yang sebenarnya
                // Ini adalah contoh, struktur bisa berbeda:
                $uniqueVisitors = $data['result'][0]['timeseries'][0]['uniques']['all'] ?? ($data['result'][0]['uniques']['all'] ?? null);
                return response()->json(['unique_visitors_total' => $uniqueVisitors]);
            }

            return response()->json(['error' => 'Gagal mengambil data dari Cloudflare', 'details' => $response->body()], $response->status());

        } catch (\Exception $e) {
            return response()->json(['error' => 'Kesalahan server saat menghubungi Cloudflare', 'message' => $e->getMessage()], 500);
        }
    }
}