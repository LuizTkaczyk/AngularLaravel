<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades;
use Tymon\JWTAuth\Exceptions;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function register(Request $request)
    {

        //verificando se o email cadastrado já existe no banco de dados
        $user = User::where('email', $request['email'])->first();

        if ($user) {
            $response['status'] = 0;
            $response['message'] = 'Email já existe na base de dados';
            $response['code'] = 409;
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password) //para o uso do bcrypt, importar o facade Hash
            ]);

            $response['status'] = 1;
            $response['message'] = 'Usuario registrado com sucesso';
            $response['code'] = 200;
        }


        return response()->json($response);
    }

    //criando o login com  email e senha
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);


        try {
            if (!JWTAuth::attempt($credentials)) {
                $response['status'] = 0;
                $response['data'] = null;
                $response['code'] = 401;
                $response['message'] = 'Email ou senha incorretos';
                return response()->json($response);
            }
        } catch (JWTException $error) {
            $response['data'] = null;
            $response['code'] = 500;
            $response['message'] = 'Não foi possivel criar o Token';
            return response()->json($response);
        }

        $user = auth()->user();
        $data['token'] = auth()->claims([
            'user_id' => $user->id,
            'email' => $user->email
        ])->attempt($credentials);

        $response['data'] = $data;
        $response['status'] = 1;
        $response['code'] = 200;
        $response['message'] = 'Login efetuado com sucesso';

        return response()->json($response);
    }
}
