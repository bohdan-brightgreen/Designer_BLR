<?php
namespace App\Http\Controllers;

use SSO;

class SSOController extends Controller
{
    public function index($token)
    {
	
        $redirect = SSO::set($token);
        if ($redirect === false) {
            $redirect = '/';
        }

        return redirect()->away($redirect);
    }

    public function logout()
    {
	
        auth()->logout();
        return redirect()->away(SSO::logoutUrl());
    }
}