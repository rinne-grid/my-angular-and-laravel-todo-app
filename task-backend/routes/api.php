<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('todos', 'TodoController');
// Route::resource('todos', 'TodoController', ['only' => [
//     'index', 'store', 'update'
// ]]);//->middleware('cors');
// Route::group(['middleware' => 'cors'], function() {
//     Route::post('/todos', 'TodoController@store');
// });


// Route::post('todos', function () {
//     return ['status'=>'success'];
//  })->middleware('cors');

//  Route::resource('todos', )