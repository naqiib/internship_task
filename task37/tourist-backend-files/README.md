# Tourist Management System — Backend (Laravel + Sanctum API)

This is not a full Laravel install — it's the **application layer** (migrations,
models, controllers, routes, seeder) for the Advanced Tourist Management System.
Drop these files into a fresh Laravel project on your machine (where PHP/Composer
already work), since this sandbox can't run `composer` or `php`.

## 1. Create a fresh Laravel project

```powershell
composer create-project laravel/laravel tourist-backend
cd tourist-backend
```

## 2. Install Sanctum (API authentication)

```powershell
composer require laravel/sanctum
php artisan install:api
```

This publishes Sanctum's config and adds the `auth:sanctum` middleware alias
automatically in Laravel 11/12.

## 3. Copy these files into your new project

Copy, overwriting where prompted:

- `database/migrations/*.php`  → `tourist-backend/database/migrations/`
- `database/seeders/TourismSeeder.php` → `tourist-backend/database/seeders/`
- `app/Models/*.php`  → `tourist-backend/app/Models/` (overwrite `User.php`)
- `app/Http/Controllers/Api/*.php` → `tourist-backend/app/Http/Controllers/Api/`
  (create the `Api` folder if it doesn't exist)
- `routes/api.php` → `tourist-backend/routes/api.php` (overwrite)

## 4. Database setup

Create a database in phpMyAdmin, e.g. `tourist_management`, then update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tourist_management
DB_USERNAME=root
DB_PASSWORD=
```

## 5. Run migrations + seed sample data

```powershell
php artisan migrate
php artisan db:seed --class=TourismSeeder
```

This creates 3 test accounts (password is `password` for all):
- `admin@example.com` (admin)
- `guide@example.com` (guide)
- `tourist@example.com` (tourist)

...and 2 sample destinations with tour packages.

## 6. Run the server

```powershell
php artisan serve
```

API is now live at `http://127.0.0.1:8000/api/...` — matches the frontend's
expected base URL. Test it directly, e.g.:

```
POST http://127.0.0.1:8000/api/login
Body (JSON): { "email": "tourist@example.com", "password": "password" }
```

## What's included

- All 9 tables from the spec (categories, destinations, tour_packages, guides,
  bookings, itineraries, reviews, favourites, notifications) + `role` on `users`
- Full Eloquent models with the relationships from the spec
- Sanctum token-based auth (register/login/logout/user)
- Role-based checks done in-controller (`isAdmin()`, `isGuide()` on User model)
- Core CRUD for destinations, packages, guides, bookings (with status updates),
  itineraries, reviews, favourites, notifications
- Admin dashboard endpoint with basic stats

## What's NOT included (documented scope cut)

These were in the original spec but are out of scope for this MVP pass —
add them incrementally once the core is working:
- Interactive map rendering (the lat/long data is there; add a map library on the frontend)
- Smart recommendation engine (would need a scoring algorithm — happy to add next)
- Real payment gateway integration
- Multi-language support
- Automated tests

## Postman-style route list

See the spec document's "Main API Routes" table — every route there is wired up
except payments (not built) and the dashboard route which is `/api/admin/dashboard`.
