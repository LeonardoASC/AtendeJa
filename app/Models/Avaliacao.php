<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    /** @use HasFactory<\Database\Factories\AvaliacaoFactory> */
    use HasFactory;

    protected $table = 'avaliacoes';

    protected $fillable = [
        'servico_avaliacao_id',
        'nota',
        'comentario',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'nota' => 'integer',
    ];

    public function servicoAvaliacao()
    {
        return $this->belongsTo(ServicoAvaliacao::class);
    }
}
