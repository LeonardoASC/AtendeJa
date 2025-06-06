<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guiche extends Model
{
    /** @use HasFactory<\Database\Factories\GuicheFactory> */
    use HasFactory;
    protected $fillable = ['numero'];

    public function tiposAtendimento()
    {
        return $this->hasMany(TipoAtendimento::class, 'guiche', 'numero');
    }
}
