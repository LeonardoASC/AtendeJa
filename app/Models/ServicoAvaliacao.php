<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicoAvaliacao extends Model
{
    use HasFactory;

    protected $table = 'servicos_avaliacao';

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
        'ordem',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'ordem' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'servico_avaliacao_id');
    }
}
