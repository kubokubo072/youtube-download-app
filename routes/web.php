<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DownloadController;
// YouTube download
use Symfony\Component\Process\Process;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// 👇 ここに関数を追加！
function tailCustom($filepath, $lines = 10)
{
    $file = new SplFileObject($filepath, 'r');
    $file->seek(PHP_INT_MAX);
    $last_line = $file->key();

    $lines = min($lines, $last_line);
    $output = [];
    for ($i = $lines; $i >= 1; $i--) {
        $file->seek($last_line - $i);
        $output[] = $file->current();
    }

    return implode("", $output);
}

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/test-yt-dlp', function () {


//         $youtubeUrl = 'https://youtu.be/UGsRdUxgq_o?si=A96lhayRgK4LItC5';

//     // $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';
//     $outputDir = public_path('videos');

//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }

//     // ログファイルのパス
//     $logFile = storage_path('logs/yt-dlp.log');


//     // /usr/local/bin/yt-dlp --version

//     // コマンド作成（ログ出力あり・バックグラウンド実行）
//     $cmd = "/usr/local/bin/yt-dlp --cookies /var/www/cookies.txt --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//     // $cmd = "/usr/bin/yt-dlp --cookies /var/www/cookies.txt --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//     . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
//     . escapeshellarg($youtubeUrl)
//     . " >> " . escapeshellarg($logFile) . " 2>&1 & echo $!";

//     // $cmd = "/usr/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//     //     . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
//     //     . escapeshellarg($youtubeUrl)
//     //     . " >> " . escapeshellarg($logFile) . " 2>&1 & echo $!";

//     exec($cmd, $output, $return_var);

//     return response()->json([
//         'command' => $cmd,
//         'output' => $output,
//         'return_var' => $return_var,
//         'log_file' => $logFile,
//         'log_tail' => file_exists($logFile) ? tailCustom($logFile, 15) : 'ログファイルがまだ存在しません',
//     ]);
// });

// use Illuminate\Support\Facades\Log;

// Route::get('/test-yt-dlp', function () {
//     // ダウンロードしたい YouTube の URL
//     $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';

//     // 出力先のパスを設定（public/videos）
//     $outputDir = public_path('videos');
//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }

//     // ログファイルの出力先（Laravelのstorage/logs/yt-dlp.log）
//     $logFile = storage_path('logs/yt-dlp.log');

//     // yt-dlp コマンドを構築
//     $cmd = "/usr/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//         . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
//         . escapeshellarg($youtubeUrl)
//         . " >> " . escapeshellarg($logFile) . " 2>&1 & echo $!";

//     // 実行
//     exec($cmd, $output, $return_var);

//     // 応答として、コマンド内容や出力結果をJSONで返す
//     return response()->json([
//         'command' => $cmd,
//         'output' => $output,
//         'return_var' => $return_var,
//         'log_file' => $logFile,
//         'log_tail' => file_exists($logFile) ? tailCustom($logFile, 10) : 'ログファイルがまだ存在しません',
//     ]);
// });

Route::get('/yt-test', function () {
    $cmd = '/usr/local/bin/yt-dlp --version 2>&1';
    exec($cmd, $output, $code);

    return response()->json([
        'output' => $output,
        'code' => $code,
    ]);
});

// Route::get('/test-yt-dlp', function () {
//     $youtubeUrl = 'https://youtu.be/NE25ievbWVs';
//     $outputDir = public_path('videos');
//     $logFile = storage_path('logs/yt-dlp.log');

//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true); // 一時的に777でもOK
//     }

//     $cmd = '/usr/local/bin/yt-dlp '
//          . '--merge-output-format mp4 '
//          . '-o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . ' '
//          . escapeshellarg($youtubeUrl)
//          . ' >> ' . escapeshellarg($logFile) . ' 2>&1 & echo $!';

//     exec($cmd, $output, $return_var);

//     return response()->json([
//         'status' => 'started',
//         'cmd' => $cmd,
//         'output' => $output,
//         'return_var' => $return_var,
//     ]);
// });

// Route::get('/test-yt-dlp', function () {
//     $youtubeUrl = 'https://youtu.be/NE25ievbWVs?si=8ogEsU5fIEeumyR1';

//     // 保存先：public/videos
//     $outputDir = public_path('videos');
//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }

//     $cmd = '/usr/local/bin/yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 '
//     . '-o ' . escapeshellarg(public_path('videos/%(title).100s.%(ext)s')) . ' '
//     . escapeshellarg($youtubeUrl) . ' > /dev/null 2>&1 & echo $!';

//     // $cmd = '/usr/local/bin/yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 '
//     //  . '-o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . ' '
//     //  . escapeshellarg($youtubeUrl) . ' > /dev/null 2>&1 & echo $!';

//     // // yt-dlp コマンドを構築
//     //     $cmd = '/root/.local/bin/yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 '
//     // // $cmd = '/usr/local/bin/yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 '
//     //  . '-o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . ' '
//     //  . escapeshellarg($youtubeUrl) . ' > /dev/null 2>&1 & echo $!';

//     // $cmd = '/usr/bin/yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 '
//     //      . '-o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . ' '
//     //      . escapeshellarg($youtubeUrl) . ' > /dev/null 2>&1 & echo $!';

//     // コマンドを実行
//     exec($cmd, $output, $return_var);

//     // レスポンス返却
//     return response()->json([
//         'message' => 'yt-dlp download started',
//         'command' => $cmd,
//         'output' => $output,
//         'return_var' => $return_var,
//     ]);
// });

// YouTube download
// Route::get('/test-yt-dlp', function () {
//     $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';
//     $outputDir = public_path('videos');

//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }
//     $cmd = "/usr/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//         . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
//         . escapeshellarg($youtubeUrl) . " > /dev/null 2>&1 & echo $!";
//     exec($cmd . ' 2>&1', $output, $return_var);
//     return response()->json([
//         'command' => $cmd,
//         'output' => $output,
//         'return_var' => $return_var,
//     ]);
// });
// Route::get('/test-yt-dlp', function () {
//     $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';
//     $outputDir = public_path('videos');

//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }

//     // yt-dlpコマンドを組み立て（バックグラウンド実行）
//     $cmd = "/opt/yt-dlp-venv/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
//         . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
//         . escapeshellarg($youtubeUrl) . " > /dev/null 2>&1 & echo $!";

//     exec($cmd, $output, $return_var);

//     // 起動したプロセスIDも返せる（必要に応じて）
//     $pid = $output[0] ?? 'unknown';

//     return response("🔁 ダウンロード処理をバックグラウンドで開始しました。プロセスID: {$pid}。完了後に /public/videos を確認してください。");
// });

Route::get('/', [DownloadController::class, 'index']);
// Route::get('/test', [DownloadController::class, 'index'])->name('test.index');


// Route::get('/yt-dlp-download', function () {
//     $youtubeUrl = request()->get('url') ?? 'https://youtu.be/UGsRdUxgq_o';
//     $outputDir = public_path('videos');
//     $logFile = storage_path('logs/yt-dlp.log');
//     $cookiesFile = base_path('cookies.txt');

//     if (!file_exists($outputDir)) {
//         mkdir($outputDir, 0777, true);
//     }

//     $cmd = implode(" ", [
//         '/usr/bin/yt-dlp',
//         '--cookies', escapeshellarg($cookiesFile),
//         '--ffmpeg-location', '/usr/bin/ffmpeg',
//         '--recode-video', 'mp4',
//         '-o', escapeshellarg($outputDir . '/%(title).100s.%(ext)s'),
//         escapeshellarg($youtubeUrl),
//         '>>', escapeshellarg($logFile),
//         '2>&1 & echo $!',
//     ]);

//     exec($cmd, $output, $return_var);

//     return response()->json([
//         'status' => 'started',
//         'command' => $cmd,
//         'pid' => $output[0] ?? null,
//         'log_tail' => file_exists($logFile) ? tailCustom($logFile, 15) : 'ログファイルがまだ生成されていません',
//     ]);
// });
require __DIR__ . '/auth.php';
