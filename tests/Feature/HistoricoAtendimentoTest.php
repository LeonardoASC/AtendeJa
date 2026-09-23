<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Senha;
use App\Models\TipoAtendimento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class HistoricoAtendimentoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::firstOrCreate(['name' => 'ver-guiche', 'guard_name' => 'admin']);
        Permission::firstOrCreate(['name' => 'ver-senhas', 'guard_name' => 'admin']);
    }

    public function test_atendente_pode_salvar_avaliacao_e_comentario(): void
    {
        $admin = Admin::factory()->create([
            'name' => 'Atendente Teste',
            'email' => 'atendente@teste.com',
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
        $admin->givePermissionTo(['ver-guiche', 'ver-senhas']);

        $tipo = TipoAtendimento::first() ?? TipoAtendimento::create(['nome' => 'Atendimento Geral']);

        $senha = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'TST-001',
            'nome' => 'Cidadão João da Silva',
            'cpf' => '99988877766',
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Teste',
            'tipo_atendimento_id' => $tipo->id,
        ]);

        $response = $this->actingAs($admin, 'admin')
            ->postJson(route('historico-atendimentos.salvar-avaliacao', $senha->id), [
                'avaliacao_tag' => 'Documentação Pendente',
                'avaliacao_cor' => '#F59E0B',
                'comentario' => 'Falta certidão de casamento e comprovante de residência.',
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Comentário registrado com sucesso!',
            ]);

        $senha->refresh();
        $this->assertEquals('Documentação Pendente', $senha->avaliacao_tag);
        $this->assertEquals('#F59E0B', $senha->avaliacao_cor);
        $this->assertEquals('Falta certidão de casamento e comprovante de residência.', $senha->comentario);
        $this->assertEquals('Atendente Teste', $senha->avaliacao_atendente_nome);
        $this->assertNotNull($senha->avaliado_em);

        // Tentar editar novamente deve retornar 422 (não é permitido editar após gravar)
        $tentativaEdicao = $this->actingAs($admin, 'admin')
            ->postJson(route('historico-atendimentos.salvar-avaliacao', $senha->id), [
                'avaliacao_tag' => 'Resolvido',
                'comentario' => 'Tentando alterar o comentário anterior.',
            ]);

        $tentativaEdicao->assertStatus(422);
    }

    public function test_historico_cidadao_retorna_outros_atendimentos_com_comentarios(): void
    {
        $admin = Admin::factory()->create([
            'name' => 'Atendente Dois',
            'email' => 'atendente2@teste.com',
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
        $admin->givePermissionTo(['ver-guiche', 'ver-senhas']);

        $tipo = TipoAtendimento::first() ?? TipoAtendimento::create(['nome' => 'Atendimento Geral']);

        $cpf = '11122233344';

        // Atendimento anterior 1 (com comentário)
        $anterior1 = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'TST-101',
            'nome' => 'Maria Oliveira',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Um',
            'tipo_atendimento_id' => $tipo->id,
            'avaliacao_tag' => 'Orientado',
            'comentario' => 'Cidadã orientada a trazer documentação comprobatória.',
            'avaliacao_atendente_nome' => 'Atendente Um',
            'avaliado_em' => now()->subDays(5),
        ]);

        // Atendimento atual
        $atual = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'TST-102',
            'nome' => 'Maria Oliveira',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Dois',
            'tipo_atendimento_id' => $tipo->id,
        ]);

        $response = $this->actingAs($admin, 'admin')
            ->getJson(route('historico-atendimentos.historico-cidadao', $atual->id));

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ]);

        $data = $response->json();
        $this->assertCount(1, $data['outros_atendimentos']);
        $this->assertEquals('TST-101', $data['outros_atendimentos'][0]['codigo']);
        $this->assertEquals('Orientado', $data['outros_atendimentos'][0]['avaliacao_tag']);
        $this->assertEquals('Cidadã orientada a trazer documentação comprobatória.', $data['outros_atendimentos'][0]['comentario']);
        $this->assertEquals('Atendente Um', $data['outros_atendimentos'][0]['avaliacao_atendente_nome']);
    }

    public function test_multiplos_atendimentos_comentarios_anteriores_de_diferentes_atendentes(): void
    {
        $admin = Admin::factory()->create([
            'name' => 'Atendente Atual',
            'email' => 'atual@teste.com',
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
        $admin->givePermissionTo(['ver-guiche', 'ver-senhas']);

        $tipo = TipoAtendimento::first() ?? TipoAtendimento::create(['nome' => 'Atendimento Geral']);
        $cpf = '98765432100';

        // Atendimento mais antigo (Atendente Paula)
        Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'PR-010',
            'nome' => 'Carlos Souza',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Paula Santos',
            'tipo_atendimento_id' => $tipo->id,
            'avaliacao_tag' => 'Documentação Pendente',
            'comentario' => 'Falta certidão de nascimento dos dependentes.',
            'avaliacao_atendente_nome' => 'Paula Santos',
            'inicio_atendimento' => now()->subDays(10),
            'created_at' => now()->subDays(10),
        ]);

        // Atendimento intermediário (Atendente Marcos)
        Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'PR-020',
            'nome' => 'Carlos Souza',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Marcos Lima',
            'tipo_atendimento_id' => $tipo->id,
            'avaliacao_tag' => 'Resolvido',
            'comentario' => 'Documentos entregues e conferidos com sucesso.',
            'avaliacao_atendente_nome' => 'Marcos Lima',
            'inicio_atendimento' => now()->subDays(2),
            'created_at' => now()->subDays(2),
        ]);

        // Atendimento atual
        $atual = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'PR-030',
            'nome' => 'Carlos Souza',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Atual',
            'tipo_atendimento_id' => $tipo->id,
            'inicio_atendimento' => now(),
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admin')
            ->getJson(route('historico-atendimentos.historico-cidadao', $atual->id));

        $response->assertOk();
        $outros = $response->json('outros_atendimentos');

        $this->assertCount(2, $outros);
        // O mais recente primeiro
        $this->assertEquals('PR-020', $outros[0]['codigo']);
        $this->assertEquals('Marcos Lima', $outros[0]['avaliacao_atendente_nome']);
        $this->assertEquals('Resolvido', $outros[0]['avaliacao_tag']);
        $this->assertEquals('Documentos entregues e conferidos com sucesso.', $outros[0]['comentario']);

        // O mais antigo depois
        $this->assertEquals('PR-010', $outros[1]['codigo']);
        $this->assertEquals('Paula Santos', $outros[1]['avaliacao_atendente_nome']);
        $this->assertEquals('Documentação Pendente', $outros[1]['avaliacao_tag']);
        $this->assertEquals('Falta certidão de nascimento dos dependentes.', $outros[1]['comentario']);
    }

    public function test_comentario_gravado_no_atendimento_atual_aparece_no_historico_cidadao(): void
    {
        $admin = Admin::factory()->create([
            'name' => 'Atendente Silva',
            'email' => 'silva@teste.com',
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
        $admin->givePermissionTo(['ver-guiche', 'ver-senhas']);

        $tipo = TipoAtendimento::first() ?? TipoAtendimento::create(['nome' => 'Atendimento Geral']);
        $cpf = '55566677788';

        $senha = Senha::create([
            'public_token' => Senha::generateUniquePublicToken(),
            'codigo' => 'TST-999',
            'nome' => 'Ana Beatriz',
            'cpf' => $cpf,
            'status' => 'atendida',
            'atendente_nome' => 'Atendente Silva',
            'tipo_atendimento_id' => $tipo->id,
        ]);

        $this->actingAs($admin, 'admin')
            ->postJson(route('historico-atendimentos.salvar-avaliacao', $senha->id), [
                'avaliacao_tag' => 'Processo Aberto',
                'avaliacao_cor' => '#2563EB',
                'comentario' => 'Processo administrativo protocolado.',
            ])->assertOk();

        // Agora busca o histórico do cidadão a partir deste atendimento
        $res = $this->actingAs($admin, 'admin')
            ->getJson(route('historico-atendimentos.historico-cidadao', $senha->id));

        $res->assertOk();
        $historico = $res->json('outros_atendimentos');
        $this->assertCount(1, $historico);
        $this->assertEquals('TST-999', $historico[0]['codigo']);
        $this->assertEquals('Processo Aberto', $historico[0]['avaliacao_tag']);
        $this->assertEquals('#2563EB', $historico[0]['avaliacao_cor']);
        $this->assertEquals('Processo administrativo protocolado.', $historico[0]['comentario']);
        $this->assertEquals('Atendente Silva', $historico[0]['avaliacao_atendente_nome']);
    }
}
