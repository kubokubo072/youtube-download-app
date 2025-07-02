<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DownloadController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/isValidUrl', [DownloadController::class, 'isValidUrl'])->name('isValidUrl');
Route::post('/execDownload', [DownloadController::class, 'execDownload'])->name('execDownload');
// Route::post('/search', [DownloadController::class, 'getUrl']);
