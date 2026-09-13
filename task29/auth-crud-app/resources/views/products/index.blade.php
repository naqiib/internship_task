<!DOCTYPE html>
<html>
<head>
    <title>Products</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f4f4f4; }
        .btn { padding: 6px 12px; text-decoration: none; border-radius: 4px; color: white; margin-right: 5px; font-size: 13px; }
        .btn-add { background: #28a745; padding: 10px 16px; }
        .btn-edit { background: #007bff; }
        .btn-delete { background: #dc3545; border: none; cursor: pointer; }
        .success { background: #d4edda; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>Products</h1>

    @if (session('success'))
        <div class="success">{{ session('success') }}</div>
    @endif

    <a href="{{ route('products.create') }}" class="btn btn-add">+ Add New Product</a>

    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
        </tr>
        @forelse ($products as $product)
        <tr>
            <td>{{ $product->id }}</td>
            <td>{{ $product->name }}</td>
            <td>${{ $product->price }}</td>
            <td>{{ $product->quantity }}</td>
            <td>
                <a href="{{ route('products.show', $product->id) }}" class="btn btn-edit">View</a>
                <a href="{{ route('products.edit', $product->id) }}" class="btn btn-edit">Edit</a>
                <form action="{{ route('products.destroy', $product->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-delete" onclick="return confirm('Are you sure?')">Delete</button>
                </form>
            </td>
        </tr>
        @empty
        <tr><td colspan="5">No products found.</td></tr>
        @endforelse
    </table>
</body>
</html>