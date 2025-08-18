<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAtendimento extends Model
{
    use HasFactory;

    protected $fillable = ['nome'];

    protected $table = 'tipo_atendimentos';

    public function senhas()
    {
        return $this->hasMany(Senha::class);
    }

    public function guiches()
    {
        return $this->belongsToMany(Guiche::class, 'guiche_tipo_atendimento')->withTimestamps();
    }
}
