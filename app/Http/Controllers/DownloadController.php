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
        // \Illuminate\Support\Facades\Log::debug('getUrl');
        // \Illuminate\Support\Facades\Log::debug($videoUrl);

        // YouTube download
        // Route::get('/test-yt-dlp', function () {
        $youtubeUrl = 'https://youtu.be/XBCML1MmQg8?si=eLkDlw8KNoq8wcNc';

        $outputDir = public_path('videos');

        if (!file_exists($outputDir)) {
            \Illuminate\Support\Facades\Log::debug(message: '3');
            mkdir($outputDir, 0777, true);
        }
        $ytDlpPath = '/usr/local/bin/yt-dlp';
        $cmd = $ytDlpPath . ' -S ext:mp4,res,codec:avc --merge-output-format mp4 '
            . escapeshellarg($youtubeUrl)
            . ' -o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s')
            . ' > /dev/null 2>&1 & echo $!';

        // $cmd = 'yt-dlp -S ext:mp4,res,codec:avc --merge-output-format mp4 "https://youtu.be/NE25ievbWVs?si=8ogEsU5fIEeumyR1"';
        // yt-dlpコマンドを組み立て（バックグラウンド実行）
        // $cmd = "/opt/yt-dlp-venv/bin/yt-dlp --ffmpeg-location /usr/bin/ffmpeg --recode-video mp4 -o "
        //     . escapeshellarg($outputDir . '/%(title).100s.%(ext)s') . " "
        //     . escapeshellarg($youtubeUrl) . " > /dev/null 2>&1 & echo $!";

        $cmd = $ytDlpPath
            . ' -S ext:mp4,res,codec:avc --merge-output-format mp4 '
            . escapeshellarg($youtubeUrl)
            . ' -o ' . escapeshellarg($outputDir . '/%(title).100s.%(ext)s')
            . ' 2>&1';  // 標準エラーもキャッチ

        exec($cmd, $output, $return_var);

        \Illuminate\Support\Facades\Log::debug('yt-dlp exec return code: ' . $return_var);
        \Illuminate\Support\Facades\Log::debug('yt-dlp exec output: ' . implode("\n", $output));
        // exec($cmd, $output, $return_var);
        // 起動したプロセスIDも返せる（必要に応じて）
        $pid = $output[0] ?? 'unknown';

        return [1];
        // return response("🔁 ダウンロード処理をバックグラウンドで開始しました。プロセスID: {$pid}。完了後に /public/videos を確認してください。");
        // });

    }
}
