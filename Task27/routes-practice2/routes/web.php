<?php

use Illuminate\Support\Facades\Route;

// Home route - loads the styled Blade view
Route::get('/', function () {
    return view('home');
});

// About route
Route::get('/about', function () {
    return 'I am a BSIT student learning Laravel routing fundamentals.';
});

// Services route - returns JSON
Route::get('/services', function () {
    return response()->json([
        'Web Development',
        'App Development',
        'UI/UX Design',
        'API Integration'
    ]);
});

// Profile route with dynamic parameter
Route::get('/profile/{name}', function ($name) {
    return "Hello, " . $name . "! Welcome to your profile page.";
});

// Calculate route
Route::get('/calculate/{num1}/{num2}', function ($num1, $num2) {
    $sum = (int) $num1 + (int) $num2;
    return "Sum of $num1 and $num2 is: " . $sum;
});

// Named route
Route::get('/contact', function () {
    return 'Contact us at: contact@example.com';
})->name('contact');

// Redirect route
Route::redirect('/old-services', '/services');