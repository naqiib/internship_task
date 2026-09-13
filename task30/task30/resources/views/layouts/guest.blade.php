<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased">
        <div class="portfolio-shell auth-page">
            <div class="auth-frame">
                <aside class="auth-story">
                    <a href="/" class="portfolio-mark" style="color: #fffdf9">NAQIB<span class="sr-only"> home</span></a>
                    <div>
                        <div class="auth-story__tag">Creative developer / 2026</div>
                        <h1>Build loud. Edit with intent.</h1>
                        <p>A focused workspace for a full-stack developer and video editor who turns rough ideas into clear digital stories.</p>
                    </div>
                    <div class="auth-story__footer">01 / 04 &nbsp; Enter the studio</div>
                </aside>
                <section class="auth-form-panel">
                    {{ $slot }}
                </section>
            </div>
        </div>
    </body>
</html>
