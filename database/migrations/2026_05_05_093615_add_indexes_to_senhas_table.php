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
            $table->index('created_at');
            $table->index('tipo_atendimento_id');
            $table->index('guiche_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('senhas', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['tipo_atendimento_id']);
            $table->dropIndex(['guiche_id']);
            $table->dropIndex(['status']);
        });
    }
};
