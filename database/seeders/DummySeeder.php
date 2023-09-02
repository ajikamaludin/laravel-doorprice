<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $settings = [
            ['id' => Str::ulid(), 'key' => 'app_name', 'value' => 'PRIZE', 'type' => 'text'],
            ['id' => Str::ulid(), 'key' => 'text_footer', 'value' => 'PRIZE © 2023', 'type' => 'text'],
            ['id' => Str::ulid(), 'key' => 'app_logo', 'value' => 'logo.png', 'type' => 'image'],
        ];

        Setting::insert($settings);
    }
}
