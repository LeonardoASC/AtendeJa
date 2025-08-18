<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guiche_tipo_atendimento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guiche_id')->constrained('guiches')->cascadeOnDelete();
            $table->foreignId('tipo_atendimento_id')->constrained('tipo_atendimentos')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['guiche_id', 'tipo_atendimento_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guiche_tipo_atendimento');
    }
};
