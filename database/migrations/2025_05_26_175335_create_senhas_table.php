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
            $table->uuid('public_token')->unique();
            $table->string('cpf', 11)->nullable();
            $table->string('email')->nullable();
            $table->string('nome')->nullable();
            $table->string('matricula')->nullable();
            $table->string('codigo', 10)->nullable();
            $table->string('prioridade')->nullable();
            $table->string('status')->nullable();
            $table->foreignId('tipo_atendimento_id')->constrained('tipo_atendimentos')->onDelete('cascade');
            $table->timestamp('inicio_atendimento')->nullable();
            $table->integer('tempo_atendimento')->nullable()->comment('Tempo em segundos');
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
