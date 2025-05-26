<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
          
class Senha extends Model
{
    /** @use HasFactory<\Database\Factories\SenhaFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'cpf',
        'codigo',
        'prioridade',
        'status',
        'tipo_atendimento_id'
    ];

    public function tipoAtendimento()
    {
        return $this->belongsTo(TipoAtendimento::class);
    }

    public static function gerarPrefixo(string $tipo)
    {
        // 1) limpa símbolos
        $label = Str::title(str_replace(['_', 'º', '°'], ' ', $tipo));

        // 2) lista de palavras a ignorar
        $stop = [
            'a',   'à',   'ante', 'após', 'até',
            'com', 'contra','de',   'desde','em',
            'entre','para','perante','por', 'sem',
            'sob', 'sobre','trás',
            'ao','aos','da','das','do','dos',
            'no','na','nos','nas',
            'pelo','pela','pelos','pelas',
            'e','ou','mas'
        ];

        // 3) explode em palavras e filtra números e stopwords
        $words = array_filter(explode(' ', $label), fn($w) => !in_array(mb_strtolower($w), $stop) && !ctype_digit($w));

        // 4) monta prefixo
        if (count($words) >= 2) {
            $first = reset($words);
            $last  = end($words);
            $pre   = mb_substr($first,0,1) . mb_substr($last,0,1);
        } else {
            $word = reset($words) ?: '';
            $pre  = mb_substr($word, 0, 2);
        }

        return Str::upper($pre);
    }
}
