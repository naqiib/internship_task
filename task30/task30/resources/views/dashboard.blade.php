<x-app-layout>
    <main class="dashboard-page">
        <div class="dashboard-wrap">
            <section class="dashboard-hero">
                <div>
                    <h1>Good to see you,<br><span>{{ Str::before(Auth::user()->name, ' ') }}.</span></h1>
                </div>
                <p>Welcome to your creative command center. A clean place to shape ideas, ship products, and keep the story moving.</p>
            </div>
            </section>

            <section class="dashboard-grid">
                <article class="dash-panel dash-panel--dark">
                    <div class="eyebrow">Now in the studio</div>
                    <h2 class="mt-3">Turning complex briefs into simple experiences.</h2>
                    <p class="mt-3">From Laravel backends to sharp edits, every project gets a point of view and a finish worth watching.</p>
                    <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div class="stat-row !block !border-0 !p-0"><strong>12</strong><span class="block mt-1">Projects shipped</span></div>
                        <div class="stat-row !block !border-0 !p-0"><strong>04</strong><span class="block mt-1">Core disciplines</span></div>
                        <div class="stat-row !block !border-0 !p-0"><strong>24</strong><span class="block mt-1">Ideas in queue</span></div>
                    </div>
                </article>

                <article class="dash-panel dash-panel--lime">
                    <div class="eyebrow">Selected work</div>
                    <h2 class="mt-3">A few things worth opening.</h2>
                    <div class="project-list">
                        <div class="project-item"><div><b>Frame / 01</b><small class="block">Product film</small></div><span aria-hidden="true">-&gt;</span></div>
                        <div class="project-item"><div><b>Atlas / 02</b><small class="block">Web platform</small></div><span aria-hidden="true">-&gt;</span></div>
                        <div class="project-item"><div><b>Signal / 03</b><small class="block">Brand system</small></div><span aria-hidden="true">-&gt;</span></div>
                    </div>
                </article>
            </section>

            <section class="dash-panel mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div><div class="eyebrow">Next move</div><h2 class="mt-2">Ready when you are.</h2><p class="mt-1">Your workspace is live. Let's make something people remember.</p></div>
                <a href="{{ route('profile.edit') }}" class="portfolio-button portfolio-button--light">Edit profile <span aria-hidden="true">-&gt;</span></a>
            </section>
        </div>
    </main>
</x-app-layout>
