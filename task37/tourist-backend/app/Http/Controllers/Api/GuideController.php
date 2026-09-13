<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;

class GuideController extends Controller
{
    public function index(Request $request)
    {
        $query = Guide::with('user');

        if (!$request->boolean('all') && !$request->user()?->isAdmin()) {
            $query->where('availability', true);
        }

        return response()->json($query->paginate(100));
    }

    public function store(Request $request)
    {
        // A guide manages their own profile, or an admin creates one for a user.
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'experience' => 'nullable|string',
            'languages' => 'nullable|string',
            'skills' => 'nullable|string',
            'availability' => 'sometimes|boolean',
        ]);

        $validated['user_id'] = $validated['user_id'] ?? $request->user()->id;

        abort_unless(
            $request->user()->isAdmin() || $request->user()->id === $validated['user_id'],
            403,
            'You may only create your own guide profile.'
        );

        $guide = Guide::create($validated);

        return response()->json($guide, 201);
    }

    public function update(Request $request, Guide $guide)
    {
        abort_unless(
            $request->user()->isAdmin() || $request->user()->id === $guide->user_id,
            403,
            'You may only update your own guide profile.'
        );

        $validated = $request->validate([
            'experience' => 'nullable|string',
            'languages' => 'nullable|string',
            'skills' => 'nullable|string',
            'availability' => 'sometimes|boolean',
        ]);

        $guide->update($validated);

        return response()->json($guide);
    }
}
