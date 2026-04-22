<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAtendimento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tem_formulario',
        'onedoc_enabled',
        'onedoc_destino_id_setor',
        'onedoc_id_assunto',
    ];

    protected $table = 'tipo_atendimentos';

    protected $casts = [
        'tem_formulario' => 'boolean',
        'onedoc_enabled' => 'boolean',
        'onedoc_destino_id_setor' => 'integer',
        'onedoc_id_assunto' => 'integer',
    ];

    public function scopeComFormulario($query)
    {
        return $query->where('tem_formulario', true);
    }

    public function senhas()
    {
        return $this->hasMany(Senha::class);
    }

    public function guiches()
    {
        return $this->belongsToMany(Guiche::class, 'guiche_tipo_atendimento')->withTimestamps();
    }
}
