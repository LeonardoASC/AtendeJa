<?php

namespace App\Events;

use App\Models\Senha;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SenhaAtualizada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Senha $senha;

    public function __construct(Senha $senha)
    {
        $this->senha = $senha;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('telao');
    }

    public function broadcastAs(): string
    {
        return 'SenhaAtualizada';
    }
}
