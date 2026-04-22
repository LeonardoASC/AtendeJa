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
        Schema::table('tipo_atendimentos', function (Blueprint $table) {
            $table->boolean('onedoc_enabled')->default(false)->after('tem_formulario');
            $table->unsignedBigInteger('onedoc_destino_id_setor')->nullable()->after('onedoc_enabled');
            $table->unsignedBigInteger('onedoc_id_assunto')->nullable()->after('onedoc_destino_id_setor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipo_atendimentos', function (Blueprint $table) {
            $table->dropColumn([
                'onedoc_enabled',
                'onedoc_destino_id_setor',
                'onedoc_id_assunto',
            ]);
        });
    }
};
