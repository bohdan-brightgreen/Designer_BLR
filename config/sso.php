<?php

return [

    'url' => 'https://' . env('SSO_HOST', 'my.ssokiko.com'),

    'clientId' => env('SSO_CLIENT_ID', 'Nwjeeu23uiS8en3mfeefoIJfw4ni73kt'),

    'secret' => env('SSO_SECRET', '65bKfwekl0Nflsmy4pMVldrgoVNUJEnn'),

    'responseTimeLimit' => 10, // seconds for valid response
];
