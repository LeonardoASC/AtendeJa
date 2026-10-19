<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VisitaTecnica extends Model
{
    /** @use HasFactory<\Database\Factories\VisitaTecnicaFactory> */
    use HasFactory;

    public const STATUS_PENDENTE = 'pendente';
    public const STATUS_AGENDADA = 'agendada';
    public const STATUS_REALIZADA = 'realizada';
    public const STATUS_CANCELADA = 'cancelada';

    public const STATUS_EM_ABERTO = [self::STATUS_PENDENTE, self::STATUS_AGENDADA];

    public const SOLICITANTES = ['proprio', 'familiar', 'responsavel', 'cuidador', 'terceiro'];

    protected $table = 'visitas_tecnicas';

    protected $fillable = [
        'protocolo',
        'exercicio',
        'status',
        'canal',

        'nome',
        'cpf',
        'telefone',
        'email',

        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'ponto_referencia',

        'justificativa',

        'solicitante_tipo',
        'solicitante_nome',
        'solicitante_telefone',

        'exige_documentacao_medica',
        'documentacao_medica_apresentada',

        'codigo_seguranca',
        'data_prevista',
        'servidores_designados',

        'realizada_em',
        'condicao_constatada',
        'observacoes',
        'admin_id',

        'ip_address',
        'user_agent',
    ];

    protected $hidden = [
        'codigo_seguranca',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'exercicio' => 'integer',
        'exige_documentacao_medica' => 'boolean',
        'documentacao_medica_apresentada' => 'boolean',
        'condicao_constatada' => 'boolean',
        'data_prevista' => 'date',
        'realizada_em' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public static function generateUniqueProtocolo(int $exercicio): string
    {
        do {
            $protocolo = sprintf('VT-%d-%s', $exercicio, Str::upper(Str::random(6)));
        } while (static::where('protocolo', $protocolo)->exists());

        return $protocolo;
    }

    /**
     * Art. 6º: após visita em que não se constatou a condição alegada, novos
     * pedidos exigem documentação médica até que ela seja apresentada.
     */
    public static function cpfExigeDocumentacaoMedica(string $cpf): bool
    {
        $ultimaNegativa = static::query()
            ->where('cpf', $cpf)
            ->where('condicao_constatada', false)
            ->latest('realizada_em')
            ->first();

        if (! $ultimaNegativa) {
            return false;
        }

        return ! static::query()
            ->where('cpf', $cpf)
            ->where('documentacao_medica_apresentada', true)
            ->where('created_at', '>', $ultimaNegativa->realizada_em ?? $ultimaNegativa->created_at)
            ->exists();
    }
}
