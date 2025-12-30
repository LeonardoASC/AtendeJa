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
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_atendimento_id')->constrained('tipo_atendimentos')->onDelete('cascade');
            $table->string('nome');
            $table->string('cpf', 11);
            $table->string('email')->nullable();
            $table->string('matricula')->nullable();
            $table->string('telefone')->nullable();
            $table->text('assinatura')->nullable();
            $table->string('foto')->nullable();
            $table->json('dados_formulario')->nullable();
            $table->enum('status', ['pendente', 'em_analise', 'aprovado', 'rejeitado', 'finalizado'])->default('pendente');
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamps();

            $table->index(['cpf', 'created_at']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};
