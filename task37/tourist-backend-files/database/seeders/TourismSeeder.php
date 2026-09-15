<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Guide;
use App\Models\TourPackage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TourismSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'naqib@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $guideUser = User::create([
            'name' => 'Ali Guide',
            'email' => 'guide@example.com',
            'password' => Hash::make('password'),
            'role' => 'guide',
        ]);

        Guide::create([
            'user_id' => $guideUser->id,
            'experience' => '5 years leading mountain treks',
            'languages' => 'English, Urdu, Khowar',
            'skills' => 'Trekking, First Aid, Local History',
            'availability' => true,
        ]);

        User::create([
            'name' => 'Test Tourist',
            'email' => 'tourist@example.com',
            'password' => Hash::make('password'),
            'role' => 'tourist',
        ]);

        $mountains = Category::create(['name' => 'Mountains', 'description' => 'High-altitude destinations']);
        $valleys = Category::create(['name' => 'Valleys', 'description' => 'Scenic valleys and greenery']);

        $chitral = Destination::create([
            'category_id' => $mountains->id,
            'name' => 'Tirich Mir Base Camp',
            'location' => 'Chitral, Pakistan',
            'description' => 'Base camp views of the highest peak in the Hindukush range.',
            'estimated_cost' => 25000,
            'best_season' => 'June - September',
            'latitude' => 36.2583,
            'longitude' => 71.8383,
        ]);

        $kalash = Destination::create([
            
            'name' => 'Kalash Valley',
            'location' => 'Chitral, Pakistan',
            'description' => 'Home to the unique Kalash culture and festivals.',
            'estimated_cost' => 15000,
            'best_season' => 'May - October',
            'latitude' => 35.6167,
            'longitude' => 71.7833,
        ]);

        TourPackage::create([
            'destination_id' => $chitral->id,
            'title' => '5-Day Tirich Mir Trek',
            'description' => 'Guided trek to the base camp with camping included.',
            'duration' => 5,
            'price' => 45000,
            'included_services' => 'Guide, camping gear, meals',
            'availability' => true,
        ]);

        TourPackage::create([
            'destination_id' => $kalash->id,
            'title' => 'Kalash Culture Weekend',
            'description' => 'A 3-day cultural immersion trip to the Kalash valleys.',
            'duration' => 3,
            'price' => 20000,
            'included_services' => 'Guide, transport, homestay',
            'availability' => true,
        ]);

        $this->command->info('Admin login: admin@example.com / password');
        $this->command->info('Guide login: guide@example.com / password');
        $this->command->info('Tourist login: tourist@example.com / password');
    }
}
