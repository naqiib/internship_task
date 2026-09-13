<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::with('category');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('best_season')) {
            $query->where('best_season', $request->input('best_season'));
        }

        return response()->json($query->paginate(12));
    }

    public function show(Destination $destination)
    {
        $destination->load(['category', 'packages', 'reviews.user']);
        $destination->loadAvg('reviews', 'rating');

        return response()->json($destination);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric',
            'best_season' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $destination = Destination::create($validated);

        return response()->json($destination, 201);
    }

    public function update(Request $request, Destination $destination)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric',
            'best_season' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $destination->update($validated);

        return response()->json($destination);
    }

    public function destroy(Request $request, Destination $destination)
    {
        $this->authorizeAdmin($request);

        $destination->delete();

        return response()->json(['message' => 'Destination deleted.']);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admin access required.');
    }
}
