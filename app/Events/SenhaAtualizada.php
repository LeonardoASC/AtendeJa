<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Senha;

class SenhaAtualizada implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The Senha instance.
     *
     * @var \App\Models\Senha
     */
    public $senha;

    /**
     * Create a new event instance.
     *
     * @param \App\Models\Senha $senha
     * @return void
     */
    public function __construct(Senha $senha)
    {
        $this->senha = $senha->loadMissing(['guiche','tipoAtendimento']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */

    public function broadcastOn(): Channel
    {
        return new Channel('senhas.telao');
    }

    public function broadcastAs(): string
    {
        return 'SenhaAtualizada';
    }

    public function broadcastWith(): array
    {
        return [
            'id'          => $this->senha->id,
            'codigo'      => $this->senha->codigo,
            'status'      => $this->senha->status,
            'guiche_id'   => $this->senha->guiche_id,
            'guiche_slug' => optional($this->senha->guiche)->slug,
            'tipo_id'     => $this->senha->tipo_atendimento_id,
            'inicio_atendimento' => optional($this->senha->inicio_atendimento)?->toISOString(),
        ];
    }
}
