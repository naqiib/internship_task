<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\TourPackage;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admin access required.');

        return response()->json(
            User::with([
                'bookings.package.destination',
                'bookings.guide.user',
                'guideProfile.bookings.package.destination',
            ])->latest()->get()
        );
    }

    public function destroyUser(Request $request, User $user)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admin access required.');
        abort_if($request->user()->id === $user->id, 422, 'You cannot delete your own admin account.');
        abort_if($user->isAdmin(), 422, 'Admin accounts cannot be deleted here.');

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function dashboard(Request $request)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admin access required.');

        return response()->json([
            'total_users' => User::count(),
            'total_tourists' => User::where('role', 'tourist')->count(),
            'total_guides' => User::where('role', 'guide')->count(),
            'total_destinations' => Destination::count(),
            'total_packages' => TourPackage::count(),
            'total_bookings' => Booking::count(),
            'bookings_by_status' => Booking::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'popular_destinations' => Destination::withCount('reviews')
                ->orderByDesc('reviews_count')
                ->take(5)
                ->get(['id', 'name']),
        ]);
    }
}
