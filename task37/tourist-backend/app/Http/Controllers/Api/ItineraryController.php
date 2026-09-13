<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class ItineraryController extends Controller
{
    public function index(Request $request, Booking $booking)
    {
        abort_unless(
            $request->user()->isAdmin() || $request->user()->id === $booking->user_id,
            403
        );

        return response()->json($booking->itineraries()->orderBy('day')->get());
    }

    public function store(Request $request, Booking $booking)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admin access required.');

        $validated = $request->validate([
            'day' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'activity_time' => 'nullable|string|max:100',
        ]);

        $itinerary = $booking->itineraries()->create($validated);

        return response()->json($itinerary, 201);
    }
}
