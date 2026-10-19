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
        Schema::create('visitas_tecnicas', function (Blueprint $table) {
            $table->id();
            $table->string('protocolo', 20)->unique();
            $table->unsignedSmallInteger('exercicio');
            $table->string('status', 20)->default('pendente');
            $table->string('canal', 20)->default('eletronico');

            // Beneficiário (Art. 2º, § 2º)
            $table->string('nome');
            $table->string('cpf', 11);
            $table->string('telefone', 11);
            $table->string('email')->nullable();

            // Endereço do atendimento
            $table->string('cep', 8)->nullable();
            $table->string('logradouro');
            $table->string('numero', 20);
            $table->string('complemento', 100)->nullable();
            $table->string('bairro', 100);
            $table->string('cidade', 100);
            $table->string('ponto_referencia', 255)->nullable();

            $table->text('justificativa');

            // Solicitante, quando não for o próprio beneficiário (Art. 2º, § 1º)
            $table->string('solicitante_tipo', 20)->default('proprio');
            $table->string('solicitante_nome')->nullable();
            $table->string('solicitante_telefone', 11)->nullable();

            // Exigência de documentação médica (Art. 6º)
            $table->boolean('exige_documentacao_medica')->default(false);
            $table->boolean('documentacao_medica_apresentada')->default(false);

            // Contato prévio e agendamento (Art. 4º)
            $table->string('codigo_seguranca', 10)->nullable();
            $table->date('data_prevista')->nullable();
            $table->string('servidores_designados')->nullable();

            // Registro da visita (Arts. 6º e 7º)
            $table->timestamp('realizada_em')->nullable();
            $table->boolean('condicao_constatada')->nullable();
            $table->text('observacoes')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('admins')->nullOnDelete();

            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();

            $table->index(['cpf', 'exercicio']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitas_tecnicas');
    }
};
