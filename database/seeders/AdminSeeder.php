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
        Admin::updateOrCreate(
            ['username' => 'hshino'],
            ['password' => Hash::make('123hshi')]
        );

        // Anda bisa menambahkan lebih banyak admin jika perlu
        // Admin::create([
        //     'username' => 'editor',
        //     'password' => 'secretpassword'
        // ]);
    }
}
