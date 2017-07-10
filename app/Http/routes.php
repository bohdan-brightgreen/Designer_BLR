<?php
Route::group(['middleware' => ['web']], function() {
    
    Route::get('/', 'LightplanController@index')->name('home');
    //Route::get('/sso', 'LightplanController@index');
    // SSO
        Route::group(['prefix' => 'sso'], function() {
	Route::get('/', 'LightplanController@index');
        Route::get('/logout', 'SSOController@logout');
        Route::get('/{token}', 'SSOController@index');
    });

    //Route::get('/proxy', 'LightplanController@proxy');
    Route::post('/upload', 'LightplanController@upload');
    Route::post('/image_crop', 'LightplanController@image_crop');
    Route::post('/pdf', 'LightplanController@pdf');

    // API
    Route::group(['prefix' => 'api'], function() {

        Route::get('/projects', 'ProjectsController@all');
        Route::get('/project/{id}', 'ProjectsController@show');
        Route::post('/project', 'ProjectsController@store');
        Route::put('/project', 'ProjectsController@update');
        Route::delete('/project/{id}', 'ProjectsController@destroy');

        Route::get('/designs/{projectId}', 'DesignsController@all');
        Route::get('/design/{id}', 'DesignsController@show');
        Route::post('/design', 'DesignsController@store');
        Route::put('/design', 'DesignsController@update');
        Route::delete('/design/{id}', 'DesignsController@destroy');

        Route::get('/areas/{designId}', 'AreasController@all');
        Route::get('/area/{id}', 'AreasController@show');
        Route::post('/area', 'AreasController@store');
        Route::put('/area', 'AreasController@update');
        Route::delete('/area/{id}', 'AreasController@destroy');

        Route::get('/share', 'ProjectAccessController@all');
        Route::post('/share', 'ProjectAccessController@store');
        Route::put('/share', 'ProjectAccessController@update');
        Route::delete('/share/{projectId}/{userId}', 'ProjectAccessController@destroy');

        Route::post('/export_image', 'ExportImageController@store');

        /*$resourceExceptions = ['create', 'edit'];
        Route::resource('project', 'ProjectsController', ['except' => $resourceExceptions]);
        Route::resource('design', 'DesignsController', ['except' => $resourceExceptions]);
        Route::resource('area', 'AreasController', ['except' => $resourceExceptions]);*/
    });

});
Route::get('users', function()
{
    return 'Users!';
});

