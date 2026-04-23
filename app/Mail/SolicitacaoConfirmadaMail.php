<?php

namespace App\Mail;

use App\Models\Solicitacao;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class SolicitacaoConfirmadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $solicitacao;
    public bool $isRecadastramento;

    /**
     * Create a new message instance.
     */
    public function __construct(Solicitacao $solicitacao)
    {
        $this->solicitacao = $solicitacao;
        $this->isRecadastramento = $this->isRecadastramentoTipo(
            $solicitacao->tipoAtendimento->nome ?? null
        );
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isRecadastramento
                ? 'Confirmacao de Recadastramento / Prova de Vida'
                : 'Confirmacao de Solicitacao - ' . ($this->solicitacao->tipoAtendimento->nome ?? 'Solicitacao'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.solicitacao-confirmada',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    private function isRecadastramentoTipo(?string $nome): bool
    {
        $normalizado = Str::upper(Str::ascii(trim((string) $nome)));
        $normalizado = preg_replace('/[^A-Z0-9]+/', '', $normalizado) ?? '';
        $alvo = preg_replace('/[^A-Z0-9]+/', '', Str::upper(Str::ascii('RECADASTRAMENTO / PROVA DE VIDA'))) ?? '';

        return $normalizado === $alvo;
    }
}
