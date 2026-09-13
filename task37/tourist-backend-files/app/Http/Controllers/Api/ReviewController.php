<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Destination $destination)
    {
        return response()->json(
            $destination->reviews()->with('user:id,name')->latest()->paginate(10)
        );
    }

    public function store(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'package_id' => 'nullable|exists:tour_packages,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = $destination->reviews()->create([
            'user_id' => $request->user()->id,
            'package_id' => $validated['package_id'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }
}
