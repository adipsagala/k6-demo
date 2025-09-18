<?php

namespace App\Http\Controllers;

class HelloController extends Controller
{

    public function index()
    {
        return response()->json([
            "status" => "SUCCESS",
            "message" => "Hello World!",
            "data" => (object)[]
        ]);
    }
}
