<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
          
class Senha extends Model
{
    /** @use HasFactory<\Database\Factories\SenhaFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'cpf',
        'tipo',
        'codigo',
        'prioridade',
        'status',
    ];
}
