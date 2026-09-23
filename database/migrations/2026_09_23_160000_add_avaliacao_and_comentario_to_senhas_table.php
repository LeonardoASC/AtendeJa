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
        Schema::table('senhas', function (Blueprint $table) {
            $table->string('avaliacao_tag')->nullable();
            $table->string('avaliacao_cor', 7)->nullable();
            $table->text('comentario')->nullable();
            $table->string('avaliacao_atendente_nome')->nullable();
            $table->timestamp('avaliado_em')->nullable();

            $table->index('cpf');
            $table->index('avaliacao_tag');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('senhas', function (Blueprint $table) {
            $table->dropIndex(['cpf']);
            $table->dropIndex(['avaliacao_tag']);
            $table->dropColumn([
                'avaliacao_tag',
                'avaliacao_cor',
                'comentario',
                'avaliacao_atendente_nome',
                'avaliado_em',
            ]);
        });
    }
};
