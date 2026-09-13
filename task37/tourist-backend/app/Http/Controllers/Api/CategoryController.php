<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function show(Category $category)
    {
        return response()->json($category->load('destinations'));
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        return response()->json(Category::create($validated), 201);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorizeAdmin($request);

        abort_if($category->destinations()->exists(), 422, 'Category has destinations and cannot be deleted.');

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admin access required.');
    }
}
