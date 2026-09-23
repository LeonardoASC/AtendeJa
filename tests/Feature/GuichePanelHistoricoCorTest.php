<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Guiche;
use App\Models\Senha;
use App\Models\TipoAtendimento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class GuichePanelHistoricoCorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Permission::firstOrCreate(['name' => 'ver-guiche', 'guard_name' => 'admin']);
    }

    public function test_guiche_panel_retorna_cor_do_comentario_anterior_na_fila_e_no_atendimento(): void
    {
        $admin = Admin::factory()->create([
            'name' => 'Atendente Guichê',
            'email' => 'atendente@guiche.com',
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
        $admin->givePermissionTo('ver-guiche');

        $guiche = Guiche::create([
            'nome' => '1',
            'slug' => '1',
        ]);

        $tipo = TipoAtendimento::create(['nome' => 'Atendimento Previdenciário']);
        $guiche->tiposAtendimento()->attach($tipo->id);

        $cpfComHistorico = '12345678901';
        $cpfSemHistorico = '99988877766';

        // Atendimento passado com comentário e cor para o primeiro CPF
        Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'ANT-001',
            'nome' => 'Cidadão Com Histórico',
            'cpf' => $cpfComHistorico,
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Passado',
            'tipo_atendimento_id' => $tipo->id,
            'guiche_id' => $guiche->id,
            'avaliacao_tag' => 'Pendência Cadastral',
            'avaliacao_cor' => '#EF4444',
            'comentario' => 'Cidadão precisa trazer certidão atualizada.',
            'avaliacao_atendente_nome' => 'Atendente Passado',
            'avaliado_em' => now()->subDays(2),
        ]);

        // Senha atual em atendimento no guichê (pertencente ao cidadão com histórico)
        $senhaAtendimento = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'ATD-100',
            'nome' => 'Cidadão Com Histórico',
            'cpf' => $cpfComHistorico,
            'status' => 'atendendo',
            'atendente_nome' => 'Atendente Guichê',
            'tipo_atendimento_id' => $tipo->id,
            'guiche_id' => $guiche->id,
            'inicio_atendimento' => now(),
        ]);

        // Senha 1 na fila (aguardando) - mesmo CPF com histórico
        $senhaFila1 = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'FILA-101',
            'nome' => 'Cidadão Com Histórico',
            'cpf' => $cpfComHistorico,
            'status' => 'aguardando',
            'tipo_atendimento_id' => $tipo->id,
        ]);

        // Senha 2 na fila (aguardando) - outro CPF sem histórico
        $senhaFila2 = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'FILA-102',
            'nome' => 'Cidadão Sem Histórico',
            'cpf' => $cpfSemHistorico,
            'status' => 'aguardando',
            'tipo_atendimento_id' => $tipo->id,
        ]);

        $response = $this->actingAs($admin, 'admin')
            ->get(route('guiche.panel', ['guiche' => $guiche->slug]));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Senha/GuichePanel')
            ->where('initialSenha.id', $senhaAtendimento->id)
            ->where('initialSenha.historico_cor', '#EF4444')
            ->where('initialSenha.historico_tag', 'Pendência Cadastral')
            ->has('queue', 2)
            ->where('queue.0.id', $senhaFila1->id)
            ->where('queue.0.historico_cor', '#EF4444')
            ->where('queue.0.historico_tag', 'Pendência Cadastral')
            ->where('queue.1.id', $senhaFila2->id)
            ->where('queue.1.historico_cor', null)
            ->has('comentariosCidadao', 1)
            ->where('comentariosCidadao.0.codigo', 'ANT-001')
            ->where('comentariosCidadao.0.avaliacao_tag', 'Pendência Cadastral')
            ->where('comentariosCidadao.0.avaliacao_cor', '#EF4444')
        );
    }
}
