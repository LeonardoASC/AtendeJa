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
        'assinatura',
        'foto',
        'admin_id',
    ];

    protected $casts = [
        'dados_formulario' => 'array',
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
