<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        // Ambil log terbaru, bisa dengan pagination
        $logs = ActivityLog::with('admin:id,username') // Hanya ambil id dan username admin
                            ->latest()
                            ->paginate($request->input('per_page', 10)); // Default 10 per halaman

        return response()->json($logs);
    }
}