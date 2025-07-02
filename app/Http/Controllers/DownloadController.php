<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Exception\ProcessTimedOutException;


class DownloadController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');
    }

    // urlが正常な場合は「タイトル/サムネイル」を取得します
    function isValidUrl(Request $request)
    {
        $videoUrl = $request->input('videoUrl');
        $process = new Process(['yt-dlp', '--dump-json', $videoUrl]);
        $process->setTimeout(8);
        $videoStatus = [];

        try {
            $process->run();
            if (!$process->isSuccessful()) {
                $videoStatus = [
                    'status' => false,
                    'message' => '不正なurlです',
                    'errorOutput' => $process->getErrorOutput()
                ];
            }

            $videoInfo = json_decode($process->getOutput(), true);
            $title = $videoInfo['title'] ?? '';
            $thumbnailUrl = $videoInfo['thumbnail'] ?? '';

            if ($title) {
                $videoStatus = [
                    'status' => true,
                    'title' => $title,
                    'thumbnail' => $thumbnailUrl,
                ];
            } else {
                $videoStatus = [
                    'status' => false,
                    'message' => '処理がタイムアウトしました。動画に制限がある可能性があります。',
                    'errorOutput' => '動画に問題がある可能性が高いです'
                ];
            }

        } catch (ProcessTimedOutException $e) {
            $videoStatus = [
                'status' => false,
                'message' => '処理がタイムアウトしました。動画に制限がある可能性があります。',
                'errorOutput' => $e->getMessage()
            ];

        } catch (\Throwable $e) {
            $videoStatus = [
                'status' => false,
                'message' => '不明なエラーが発生しました。',
                'errorOutput' => $e->getMessage()
            ];
        }
        return response()->json($videoStatus);
    }

    public function execDownload(Request $request)
    {
        $youtubeUrl = $request->input('videoUrl');
        $selectedFormat = $request->input('selectedFormat');
        $title = $request->input('videoTitle');
        $outputDir = public_path('videos');

        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0777, true);
        }

        $ytDlpPath = '/usr/local/bin/yt-dlp';
        // $safeTitle = substr($title, 0, 100); // yt-dlpの%(title).100sに合わせる

        // ✅ ファイル名として使えない文字を除去し、100文字制限
        $safeTitle = preg_replace('/[^\w\- ]+/u', '', $title);
        $safeTitle = mb_substr($safeTitle, 0, 100);

        if ($selectedFormat == 1) {
            $fileExt = 'mp4';
            $cmd = $ytDlpPath
                . ' -S ext:mp4,res,codec:avc --merge-output-format mp4 '
                . escapeshellarg($youtubeUrl)
                . ' -o ' . escapeshellarg($outputDir . '/' . $safeTitle . '.%(ext)s')
                . ' 2>&1';
        } else if ($selectedFormat == 2) {
            $fileExt = 'mp3';
            $cmd = $ytDlpPath
                . ' --extract-audio --audio-format mp3 '
                . escapeshellarg($youtubeUrl)
                . ' -o ' . escapeshellarg($outputDir . '/' . $safeTitle . '.%(ext)s')
                . ' 2>&1';
        }

        exec($cmd, $output, $return_var);
        $fileName = $safeTitle . '.' . $fileExt;
        $downloadUrl = asset('videos/' . $fileName);

        return response()->json([
            'status' => true,
            'downloadUrl' => $downloadUrl,
            'fileName' => $fileName,
        ]);
    }
}
