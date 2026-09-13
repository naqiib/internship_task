<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\TourPackage;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Booking::with(['package.destination', 'guide.user']);

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:tour_packages,id',
            'travel_date' => 'required|date|after:today',
            'persons' => 'required|integer|min:1',
        ]);

        $package = TourPackage::findOrFail($validated['package_id']);

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'package_id' => $package->id,
            'travel_date' => $validated['travel_date'],
            'persons' => $validated['persons'],
            'total_cost' => $package->price * $validated['persons'],
            'status' => 'pending',
        ]);

        Notification::create([
            'user_id' => $request->user()->id,
            'title' => 'Booking Submitted',
            'message' => "Your booking for {$package->title} is pending confirmation.",
        ]);

        return response()->json($booking->load('package.destination'), 201);
    }

    public function show(Request $request, Booking $booking)
    {
        $this->authorizeOwnerOrAdmin($request, $booking);

        return response()->json($booking->load(['package.destination', 'guide.user', 'itineraries']));
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admin access required.');

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,rejected,completed,cancelled',
            'guide_id' => 'nullable|exists:guides,id',
        ]);

        $booking->update($validated);

        Notification::create([
            'user_id' => $booking->user_id,
            'title' => 'Booking Update',
            'message' => "Your booking status changed to {$booking->status}.",
        ]);

        return response()->json($booking);
    }

    private function authorizeOwnerOrAdmin(Request $request, Booking $booking): void
    {
        abort_unless(
            $request->user()->isAdmin() || $request->user()->id === $booking->user_id,
            403,
            'You do not have access to this booking.'
        );
    }
}
