<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // READ - Show all products
    public function index()
    {
        $products = Product::latest()->get();
        return view('products.index', compact('products'));
    }

    // CREATE - Show form
    public function create()
    {
        return view('products.create');
    }

    // CREATE - Store data
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index')->with('success', 'Product added successfully!');
    }

    // READ - Show single product
    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    // UPDATE - Show edit form
    public function edit(Product $product)
    {
        return view('products.edit', compact('product'));
    }

    // UPDATE - Save changes
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        $product->update($request->all());

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    // DELETE
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }
}