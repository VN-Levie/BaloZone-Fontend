# File: cmd

```bash
# This script logs in to the BaloZone backend and retrieves the roles.
curl -X POST http://localhost:8000/api/auth/login \
cmdand>   -H "Content-Type: application/json" \
cmdand>   -d '{"email":"admin@balozone.com","password":"admin123"}'
```

```json
{"success":true,"message":"\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng","user":{"id":1,"name":"Admin BaloZone","email":"admin@balozone.com","email_verified_at":null,"phone":"0901234567","status":"active","created_at":"2025-07-03T19:42:46.000000Z","updated_at":"2025-07-03T19:42:46.000000Z","roles":[{"id":1,"name":"admin","display_name":"Admin","description":"Qu\u1ea3n tr\u1ecb vi\u00ean h\u1ec7 th\u1ed1ng - c\u00f3 quy\u1ec1n truy c\u1eadp to\u00e0n b\u1ed9 h\u1ec7 th\u1ed1ng","created_at":"2025-07-03T19:42:46.000000Z","updated_at":"2025-07-03T19:42:46.000000Z","pivot":{"user_id":1,"role_id":1}}]},"authorization":{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE1NzE4NzIsImV4cCI6MTc1MTU3NTQ3MiwibmJmIjoxNzUxNTcxODcyLCJqdGkiOiJvbHl4M002VGJZdUJmSFE2Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.QzQ8l2Dh45mZZ04FmnshX11yEYlyEY46xaYccZ_nc0M","type":"bearer","expires_in":3600}}
```

```bash
curl -X GET http://localhost:8000/api/roles \
cmdand>   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE1NzE4NzIsImV4cCI6MTc1MTU3NTQ3MiwibmJmIjoxNzUxNTcxODcyLCJqdGkiOiJvbHl4M002VGJZdUJmSFE2Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.QzQ8l2Dh45mZZ04FmnshX11yEYlyEY46xaYccZ_nc0M"
```

```json
{"success":true,"data":[{"id":1,"name":"admin","display_name":"Admin","description":"Qu\u1ea3n tr\u1ecb vi\u00ean h\u1ec7 th\u1ed1ng - c\u00f3 quy\u1ec1n truy c\u1eadp to\u00e0n b\u1ed9 h\u1ec7 th\u1ed1ng","created_at":"2025-07-03T19:42:46.000000Z","updated_at":"2025-07-03T19:42:46.000000Z","users_count":1},{"id":2,"name":"user","display_name":"User","description":"Ng\u01b0\u1eddi d\u00f9ng th\u00f4ng th\u01b0\u1eddng - c\u00f3 th\u1ec3 mua h\u00e0ng v\u00e0 s\u1eed d\u1ee5ng c\u00e1c t\u00ednh n\u0103ng c\u01a1 b\u1ea3n","created_at":"2025-07-03T19:42:46.000000Z","updated_at":"2025-07-03T19:42:46.000000Z","users_count":21},{"id":3,"name":"contributor","display_name":"C\u1ed9ng t\u00e1c vi\u00ean","description":"C\u1ed9ng t\u00e1c vi\u00ean - c\u00f3 th\u1ec3 qu\u1ea3n l\u00fd s\u1ea3n ph\u1ea9m v\u00e0 \u0111\u01a1n h\u00e0ng","created_at":"2025-07-03T19:42:46.000000Z","updated_at":"2025-07-03T19:42:46.000000Z","users_count":1}]}
```

```php
# routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AddressBookController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SaleCampaignController;
use App\Http\Controllers\RoleController;

// Public routes
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// ===================
// PUBLIC ROUTES (READ-ONLY)
// ===================

// Brand routes (public read-only)
Route::get('brands', [BrandController::class, 'index']);
Route::get('brands/{brand}', [BrandController::class, 'show']);
Route::get('brands-active', [BrandController::class, 'getActiveBrands']);

// Category routes (public read-only)
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);
Route::get('categories-with-products', [CategoryController::class, 'getWithProducts']);
Route::get('categories/slug/{slug}', [CategoryController::class, 'getBySlug']);

// Product routes (public read-only)
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);
Route::get('products-featured', [ProductController::class, 'getFeatured']);
Route::get('products/category/{categorySlug}', [ProductController::class, 'getByCategory']);
Route::get('products/brand/{brandSlug}', [ProductController::class, 'getByBrand']);
Route::get('products-search', [ProductController::class, 'search']);
Route::get('products-on-sale', [ProductController::class, 'getOnSale']);
Route::get('products/{product}/sale-campaigns', [ProductController::class, 'getSaleCampaigns']);

// Voucher routes (public read-only)
Route::get('vouchers', [VoucherController::class, 'index']);
Route::get('vouchers/{voucher}', [VoucherController::class, 'show']);
Route::post('vouchers/validate', [VoucherController::class, 'validateCode']);
Route::get('vouchers-active', [VoucherController::class, 'getActive']);

// Comment routes (public read-only)
Route::get('comments', [CommentController::class, 'index']);
Route::get('comments/{comment}', [CommentController::class, 'show']);
Route::get('comments/product/{productId}', [CommentController::class, 'getByProduct']);

// News routes (public read-only)
Route::get('news', [NewsController::class, 'index']);
Route::get('news/{news}', [NewsController::class, 'show']);
Route::get('news-latest', [NewsController::class, 'getLatest']);

// Contact routes (public)
Route::post('contacts', [ContactController::class, 'store']);
Route::get('contacts', [ContactController::class, 'index']);
Route::get('contacts/{contact}', [ContactController::class, 'show']);

// Sale Campaign routes (public read-only)
Route::get('sale-campaigns', [SaleCampaignController::class, 'index']);
Route::get('sale-campaigns/{saleCampaign}', [SaleCampaignController::class, 'show']);
Route::get('sale-campaigns-active', [SaleCampaignController::class, 'getActive']);
Route::get('sale-campaigns-featured', [SaleCampaignController::class, 'getFeatured']);
Route::get('sale-campaigns/{saleCampaign}/products', [SaleCampaignController::class, 'getProducts']);

// ===================
// AUTHENTICATED USER ROUTES
// ===================

// ===================
// AUTHENTICATED USER ROUTES
// ===================

Route::middleware('auth:api')->group(function () {
    // User profile routes
    Route::get('profile', [UserController::class, 'profile']);
    Route::put('profile', [UserController::class, 'updateProfile']);
    Route::post('change-password', [UserController::class, 'changePassword']);
    Route::get('user-stats', [UserController::class, 'getStats']);
    Route::delete('delete-account', [UserController::class, 'deleteAccount']);

    // Address book routes
    Route::apiResource('address-books', AddressBookController::class);

    // Order routes
    Route::apiResource('orders', OrderController::class)->except(['update', 'destroy']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('orders-stats', [OrderController::class, 'getStats']);

    // User comments
    Route::post('comments', [CommentController::class, 'store']);
    Route::put('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);
    Route::get('my-comments', [CommentController::class, 'getUserComments']);
});

// ===================
// ADMIN ROUTES (Admin only)
// ===================

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Role management
    Route::apiResource('roles', RoleController::class);
    Route::post('roles/assign', [RoleController::class, 'assignRole']);
    Route::post('roles/remove', [RoleController::class, 'removeRole']);

    // User management
    Route::get('admin/users', [UserController::class, 'index']);
    Route::put('admin/users/{user}', [UserController::class, 'update']);
    Route::delete('admin/users/{user}', [UserController::class, 'destroy']);
    Route::post('admin/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
});

// ===================
// CONTRIBUTOR ROUTES (Admin or Contributor)
// ===================

Route::middleware(['auth:api', 'role:admin,contributor'])->group(function () {
    // Brand management
    Route::post('brands', [BrandController::class, 'store']);
    Route::put('brands/{brand}', [BrandController::class, 'update']);
    Route::delete('brands/{brand}', [BrandController::class, 'destroy']);

    // Category management
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    // Product management
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);

    // Voucher management
    Route::post('vouchers', [VoucherController::class, 'store']);
    Route::put('vouchers/{voucher}', [VoucherController::class, 'update']);
    Route::delete('vouchers/{voucher}', [VoucherController::class, 'destroy']);

    // Sale Campaign management
    Route::post('sale-campaigns', [SaleCampaignController::class, 'store']);
    Route::put('sale-campaigns/{saleCampaign}', [SaleCampaignController::class, 'update']);
    Route::delete('sale-campaigns/{saleCampaign}', [SaleCampaignController::class, 'destroy']);
    Route::post('sale-campaigns/{saleCampaign}/products', [SaleCampaignController::class, 'addProducts']);
    Route::delete('sale-campaigns/{saleCampaign}/products/{product}', [SaleCampaignController::class, 'removeProduct']);

    // News management
    Route::post('news', [NewsController::class, 'store']);
    Route::put('news/{news}', [NewsController::class, 'update']);
    Route::delete('news/{news}', [NewsController::class, 'destroy']);

    // Order management
    Route::get('admin/orders', [OrderController::class, 'adminIndex']);
    Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Contact management
    Route::get('admin/contacts', [ContactController::class, 'adminIndex']);
    Route::put('contacts/{contact}', [ContactController::class, 'update']);
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy']);
});
```
