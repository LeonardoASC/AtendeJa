<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAtendimento extends Model
{
    /** @use HasFactory<\Database\Factories\TipoAtendimentoFactory> */
    use HasFactory;
    protected $fillable = ['nome'];
    protected $table = 'tipo_atendimentos';
}
