<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\FavouriteController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TourPackageController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public browse routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);
Route::get('/destinations/{destination}/reviews', [ReviewController::class, 'index']);
Route::get('/packages', [TourPackageController::class, 'index']);
Route::get('/packages/{package}', [TourPackageController::class, 'show']);
Route::get('/guides', [GuideController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Admin-protected writes are checked inside each controller (role stored on the user).
    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::put('/destinations/{destination}', [DestinationController::class, 'update']);
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::post('/packages', [TourPackageController::class, 'store']);
    Route::put('/packages/{package}', [TourPackageController::class, 'update']);
    Route::delete('/packages/{package}', [TourPackageController::class, 'destroy']);

    Route::post('/guides', [GuideController::class, 'store']);
    Route::put('/guides/{guide}', [GuideController::class, 'update']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::get('/bookings/{booking}/itinerary', [ItineraryController::class, 'index']);
    Route::post('/bookings/{booking}/itinerary', [ItineraryController::class, 'store']);

    Route::post('/destinations/{destination}/reviews', [ReviewController::class, 'store']);

    Route::get('/favourites', [FavouriteController::class, 'index']);
    Route::post('/favourites/{destinationId}', [FavouriteController::class, 'store']);
    Route::delete('/favourites/{destinationId}', [FavouriteController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroyUser']);
});
