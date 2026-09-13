<!DOCTYPE html>
<html>
<head>
    <title>Add Product</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
        input, textarea { width: 100%; padding: 8px; margin-bottom: 12px; box-sizing: border-box; }
        label { font-weight: bold; }
        button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .error { color: red; font-size: 13px; }
        a { display: inline-block; margin-bottom: 15px; }
    </style>
</head>
<body>
    <a href="{{ route('products.index') }}">&larr; Back to list</a>
    <h1>Add New Product</h1>

    <form action="{{ route('products.store') }}" method="POST">
        @csrf
        <label>Name</label>
        <input type="text" name="name" value="{{ old('name') }}">
        @error('name') <div class="error">{{ $message }}</div> @enderror

        <label>Description</label>
        <textarea name="description">{{ old('description') }}</textarea>

        <label>Price</label>
        <input type="number" step="0.01" name="price" value="{{ old('price') }}">
        @error('price') <div class="error">{{ $message }}</div> @enderror

        <label>Quantity</label>
        <input type="number" name="quantity" value="{{ old('quantity') }}">
        @error('quantity') <div class="error">{{ $message }}</div> @enderror

        <button type="submit">Save Product</button>
    </form>
</body>
</html>