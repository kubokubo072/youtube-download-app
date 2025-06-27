<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// YouTube download
use Symfony\Component\Process\Process;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// YouTube download
Route::get('/test-yt-dlp', function () {
    $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';
    $outputDir = public_path('videos');

    if (!file_exists($outputDir)) {
        mkdir($outputDir, 0777, true);
    }

    // yt-dlpコマンドを組み立て（バックグラウンド実行）
    $cmd = "/opt/yt-dlp-venv/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
        . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
        . escapeshellarg($youtubeUrl) . " > /dev/null 2>&1 & echo $!";

    exec($cmd, $output, $return_var);

    // 起動したプロセスIDも返せる（必要に応じて）
    $pid = $output[0] ?? 'unknown';

    return response("🔁 ダウンロード処理をバックグラウンドで開始しました。プロセスID: {$pid}。完了後に /public/videos を確認してください。");
});

require __DIR__ . '/auth.php';
