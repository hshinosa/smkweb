<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'username' => 'hshino', // Ganti dengan username yang diinginkan
            'password' => '123hshi', // Ganti dengan password yang aman. Laravel akan otomatis hash karena cast di model.
        ]);

        // Anda bisa menambahkan lebih banyak admin jika perlu
        // Admin::create([
        //     'username' => 'editor',
        //     'password' => 'secretpassword'
        // ]);
    }
}
