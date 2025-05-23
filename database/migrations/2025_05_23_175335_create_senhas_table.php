<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('senhas', function (Blueprint $table) {
            $table->id();
            $table->string('cpf', 11);
            $table->string('codigo', 10)->unique();
            $table->string('tipo')->default('Informacao');
            $table->enum('prioridade', ['alta', 'media', 'baixa'])->default('baixa');
            $table->enum('status', ['aguardando', 'atendido'])->default('aguardando');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('senhas');
    }
};
