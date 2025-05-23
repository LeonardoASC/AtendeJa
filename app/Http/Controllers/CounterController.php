<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Events\CounterUpdated;

class CounterController extends Controller
{
    /**
     * Mostrar a página do contador
    */
    public function index()
    {
        return Inertia::render('Counter', [
            'initialValue' => $this->getCurrentValue()
        ]);
    }
    /**
     * Obter o valor atual do contador
    */

    public function getCurrentValue()
    {
        return Cache::get('counter', 0);
    }

    /**
     * Incrementar o valor do contador
     */
    public function increment()
    {
        $value = $this->getCurrentValue();
        $value++;
        $this->updateValue($value);
        
        return redirect()->back();
    }

    /**
     * Decrementar o valor do contador
     */
    public function decrement()
    {
        $value = $this->getCurrentValue();
        $value--;
        $this->updateValue($value);
        
        return redirect()->back();
    }
    
    /**
     * Atualizar o valor do contador e disparar evento
     */
    private function updateValue($value)
    {
        Cache::put('counter', $value, now()->addDays(30));
        event(new CounterUpdated($value));
    }
}
