<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guiche extends Model
{
    /** @use HasFactory<\Database\Factories\GuicheFactory> */
    use HasFactory;
    protected $fillable = ['nome','slug'];

    public function tiposAtendimento()
    {
        return $this->belongsToMany(TipoAtendimento::class, 'guiche_tipo_atendimento')->withTimestamps();
    }

}
