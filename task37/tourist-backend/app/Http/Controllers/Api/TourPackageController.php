<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use Illuminate\Http\Request;

class TourPackageController extends Controller
{
    public function index(Request $request)
    {
        $query = TourPackage::with('destination');

        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->input('destination_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        if (!$request->boolean('all') && !$request->user()?->isAdmin()) {
            $query->where('availability', true);
        }

        return response()->json($query->paginate(100));
    }

    public function show(TourPackage $package)
    {
        $package->load('destination');

        return response()->json($package);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'included_services' => 'nullable|string',
            'availability' => 'sometimes|boolean',
        ]);

        $package = TourPackage::create($validated);

        return response()->json($package, 201);
    }

    public function update(Request $request, TourPackage $package)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'destination_id' => 'sometimes|exists:destinations,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'included_services' => 'nullable|string',
            'availability' => 'sometimes|boolean',
        ]);

        $package->update($validated);

        return response()->json($package);
    }

    public function destroy(Request $request, TourPackage $package)
    {
        $this->authorizeAdmin($request);

        $package->delete();

        return response()->json(['message' => 'Package deleted.']);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admin access required.');
    }
}
