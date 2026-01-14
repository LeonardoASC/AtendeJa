<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{
    use HasFactory;

    protected $table = 'solicitacoes';

    protected $fillable = [
        'tipo_atendimento_id',
        'nome',
        'cpf',
        'email',
        'matricula',
        'telefone',
        'dados_formulario',
        'status',
        'anexo',
        'admin_id',

        'one_doc_hash',
        'one_doc_id_emissao',
        'one_doc_numero',
        'one_doc_ano',
        'one_doc_status',
        'one_doc_last_error',
        'one_doc_synced_at',
    ];

    protected $casts = [
        'dados_formulario' => 'array',
        'status' => 'string',

        'one_doc_id_emissao' => 'integer',
        'one_doc_numero' => 'integer',
        'one_doc_synced_at' => 'datetime',
    ];

    /**
     * Relacionamento com TipoAtendimento
     */
    public function tipoAtendimento()
    {
        return $this->belongsTo(TipoAtendimento::class);
    }

    /**
     * Relacionamento com Admin (quem analisou/processou)
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
