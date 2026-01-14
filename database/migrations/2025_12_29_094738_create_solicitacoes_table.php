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
            $table->string('anexo')->nullable();
            $table->json('dados_formulario')->nullable();
            $table->enum('status', ['pendente', 'enviado'])->default('pendente');

            $table->string('onedoc_hash')->nullable();
            $table->unsignedBigInteger('onedoc_id_emissao')->nullable();
            $table->string('onedoc_codigo')->nullable();
            $table->string('onedoc_numero')->nullable();
            $table->string('onedoc_status')->nullable();
            $table->json('onedoc_payload')->nullable();
            $table->json('onedoc_response')->nullable();
            $table->text('onedoc_error')->nullable();
            $table->timestamp('onedoc_opened_at')->nullable();

            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamps();

            $table->index(['cpf', 'created_at']);
            $table->index('status');
            $table->index('onedoc_hash');
            $table->index('onedoc_status');
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
