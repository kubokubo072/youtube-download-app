<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DownloadController;
// YouTube download
use Symfony\Component\Process\Process;

Route::get('/', [DownloadController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Route::get('/yt-test', function () {
//     $cmd = '/usr/local/bin/yt-dlp --version 2>&1';
//     exec($cmd, $output, $code);

//     return response()->json([
//         'output' => $output,
//         'code' => $code,
//     ]);
// });

require __DIR__ . '/auth.php';
