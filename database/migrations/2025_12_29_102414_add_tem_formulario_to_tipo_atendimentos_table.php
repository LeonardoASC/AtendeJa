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
            $table->boolean('tem_formulario')->default(false)->after('nome');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipo_atendimentos', function (Blueprint $table) {
            $table->dropColumn('tem_formulario');
        });
    }
};
