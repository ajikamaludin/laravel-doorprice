<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventDrawController;
use App\Http\Controllers\Api\GiftController;
use App\Http\Controllers\Api\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/roles', [RoleController::class, 'index'])->name('api.role.index');
Route::get('/events', [EventController::class, 'index'])->name('api.event.index');
Route::get('/gifts', [GiftController::class, 'index'])->name('api.gift.index');

Route::get('/draw/{event}/reguler', [EventDrawController::class, 'reguler'])->name('api.draw.reguler');
