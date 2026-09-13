<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel Routing Practice</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
        p.subtitle { color: #777; margin-bottom: 30px; }
        .routes { display: flex; flex-direction: column; gap: 12px; }
        .routes a {
            display: block;
            padding: 14px 20px;
            background: #f4f4f9;
            color: #4a4a4a;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.25s ease;
            border: 2px solid transparent;
        }
        .routes a:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Laravel Routing Practice</h1>
        <p class="subtitle">Click any route below to test it</p>
        <div class="routes">
            <a href="/about">📄 About</a>
            <a href="/services">🛠️ Services (JSON)</a>
            <a href="/profile/Enzee">👤 Profile</a>
            <a href="/calculate/5/10">➕ Calculate (5 + 10)</a>
            <a href="/contact">📞 Contact</a>
            <a href="/old-services">🔀 Redirect Test</a>
        </div>
    </div>
</body>
</html>