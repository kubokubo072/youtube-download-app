<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DownloadController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');
    }

    public function getUrl(Request $request)
    {
        $videoUrl = $request->input('videoUrl');
        \Illuminate\Support\Facades\Log::debug('getUrl');
        \Illuminate\Support\Facades\Log::debug($videoUrl);

        // YouTube download
        // Route::get('/test-yt-dlp', function () {
        $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';

        \Illuminate\Support\Facades\Log::debug(message: '1');

        $outputDir = public_path('videos');

        \Illuminate\Support\Facades\Log::debug(message: '2');

        if (!file_exists($outputDir)) {
            \Illuminate\Support\Facades\Log::debug(message: '3');

            mkdir($outputDir, 0777, true);
        }
        \Illuminate\Support\Facades\Log::debug(message: '4');

        // yt-dlpコマンドを組み立て（バックグラウンド実行）
        $cmd = "/opt/yt-dlp-venv/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
            . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
            . escapeshellarg($youtubeUrl) . " > /dev/null 2>&1 & echo $!";
        \Illuminate\Support\Facades\Log::debug(message: '5');

        exec($cmd, $output, $return_var);
        \Illuminate\Support\Facades\Log::debug(message: '6');

        // 起動したプロセスIDも返せる（必要に応じて）
        $pid = $output[0] ?? 'unknown';

        return response("🔁 ダウンロード処理をバックグラウンドで開始しました。プロセスID: {$pid}。完了後に /public/videos を確認してください。");
        // });

    }
}
