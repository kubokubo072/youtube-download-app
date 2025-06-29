<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DownloadController extends Controller
{
    public function index()
    {
        return Inertia::render('Home'); // ✅ Pages/Home.jsx を指す


        // return Inertia::render('Pages/Home'); // ✅ OK
        // return Inertia::render('/Home'); // ← これでOK！

        // return inertia::render('Home', [
        //     'shops' => 99,
        //     // 'newReviews' => $newReviews,
        // ]);
    }
}
