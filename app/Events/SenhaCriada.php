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

class SenhaCriada implements ShouldBroadcastNow
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
        $this->senha = $senha;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */

    public function broadcastOn(): array
    {
        return [
            new Channel('senhas.novas'),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * By default, Laravel uses the class name. You can customize it here.
     * We'll use the default 'SenhaCriada'.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'SenhaCriada';
    }

    /**
     * Get the data to broadcast.
     * This method is called when the event is broadcasted.
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'message' => 'Nova senha criada: ' . $this->senha->codigo,
            'senha' => [
                'id' => $this->senha->id,
                'codigo' => $this->senha->codigo,
                'cpf' => $this->senha->cpf,
                'tipo_atendimento_id' => $this->senha->tipo_atendimento_id,
                'status' => $this->senha->status,
            ],
        ];
    }
}

