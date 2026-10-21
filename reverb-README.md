# Reverb — servidor WebSocket independente

Servidor Laravel Reverb próprio, sem vínculo com o código do sistema hospedado no cPanel.
Ele só recebe publicações autenticadas (API HTTP compatível com Pusher) e distribui os
eventos aos clientes WebSocket. A autorização de canais privados e de presença continua
no sistema Laravel de cada aplicação.

| Item | Valor |
|---|---|
| Endereço público | `wss://ws.2-25-227-236.sslip.io` (WSS 443) / `https://ws.2-25-227-236.sslip.io` (API) |
| Rotas expostas | apenas `/app/*` (WebSocket) e `/apps/*` (API de publicação). O restante retorna 404 no Traefik |
| Diretório | `/opt/stacks/reverb` |
| Stack / projeto Compose | `reverb` |
| Serviço / container | `reverb` |
| Rede | `proxy` (externa, a mesma do Traefik) |
| Traefik | entrypoint `websecure`, certresolver `le` (Let's Encrypt HTTP-01), router/serviço `reverb` |
| Imagem | `local/reverb-server:1.12.0-php8.4.26` (build local) |
| Versões | PHP 8.4.26 (alpine 3.23), Laravel 13.38.0 (skeleton 13.11.0), laravel/reverb 1.12.0, Composer 2.10.3, ext-event 3.1.6 |

## Estrutura

```
/opt/stacks/reverb/
├── docker-compose.yml        # stack (também pode ser colada no Portainer)
├── README.md
├── secrets.example.json      # formato do arquivo de aplicações (sem segredos)
├── .gitignore                # exclui secrets/ e vendor/
├── secrets/                  # 0750 root:10001  (NUNCA versionar)
│   ├── app_key               # 0640 APP_KEY própria desta instalação
│   └── reverb-apps.json      # 0640 apps: app_id, key, secret, allowed_origins
├── scripts/
│   ├── generate-secrets.py   # cria segredos/apps sem imprimi-los; nunca sobrescreve
│   ├── show-credentials.py   # exibe credenciais de uma app no terminal
│   └── smoke-test.py         # teste ponta a ponta pelo endereço público
└── app/                      # instalação Laravel mínima
    ├── Dockerfile
    ├── .dockerignore
    ├── .env.example          # referência das variáveis (sem segredos)
    ├── composer.json / composer.lock   # versões fixadas (platform php 8.4.26)
    ├── config/reverb.php     # lê as apps de REVERB_APPS_FILE
    ├── config/app.php        # APP_KEY lida de APP_KEY_FILE
    └── healthcheck.php
```

### Origem de cada configuração persistente

| Configuração | Origem | Sobrevive a rebuild/recreate? |
|---|---|---|
| Variáveis não secretas (hosts, portas, drivers, log) | `environment:` em `docker-compose.yml` | sim |
| APP_KEY | `secrets/app_key` → bind mount `/run/secrets/app_key:ro` | sim (fica no host) |
| Apps, chaves, segredos e origens | `secrets/reverb-apps.json` → `/run/secrets/reverb-apps.json:ro` | sim (fica no host) |
| Código e dependências | imagem (`app/` + `composer.lock`) | reconstruída de forma reproduzível |
| Certificado TLS | `/opt/stacks/traefik/letsencrypt/acme.json` (Traefik) | sim |
| `storage/` (cache de arquivo, sinal de `reverb:restart`) | tmpfs, descartável | não precisa |

Os segredos não ficam na imagem (`secrets/` está fora do contexto de build), no Git nem em
variáveis de ambiente visíveis no `docker inspect`.

## Decisões de implantação

- **Docker Compose (não Swarm)**, seguindo o padrão `/opt/stacks/<nome>/docker-compose.yml` do Traefik e do Portainer, com `restart: unless-stopped` e `no-new-privileges`.
- **Sem porta publicada no host.** O Traefik alcança `reverb:8080` pela rede `proxy`.
- **Router restrito** a `Host(ws…) && (PathPrefix(/app/) || PathPrefix(/apps/))`, sem middlewares. Não há middlewares globais no Traefik, e a Basic Auth do dashboard e o login do Portainer continuam intactos.
- **Processo principal:** `tini` → `php artisan reverb:start --host=0.0.0.0 --port=8080`. Com `ext-pcntl`, o Reverb trata SIGTERM e desconecta os clientes de forma ordenada (`stop_grace_period: 20s`). Não há Supervisor.
- **ext-event:** sem ela, o ReactPHP usaria `stream_select` (limite de 1024 descritores). Com ela, o loop é `ExtEventLoop`, e `nofile=65536` passa a ter efeito.
- **Usuário sem privilégios** `reverb` (uid/gid 10001), `cap_drop: ALL`, raiz do sistema de arquivos somente leitura e tmpfs em `/app/storage` e `/tmp`.
- **Sem banco, Redis, fila ou sessão:** `CACHE_STORE=file`, `SESSION_DRIVER=array`, `QUEUE_CONNECTION=sync`, `BROADCAST_CONNECTION=null`, `DB_CONNECTION=sqlite` com `:memory:` (nada é migrado nem persistido). Escalabilidade via Redis desativada (instância única).
- **Logs** em stdout/stderr (`LOG_CHANNEL=stderr`, `LOG_LEVEL=warning`, sem `--debug`), com rotação json-file de 10 MB × 5 arquivos.
- **Recursos:** limite de 1,5 CPU, 512 MB de RAM e 128 PIDs. O consumo em repouso é de cerca de 33 MB. Nada é reservado.
- **Healthcheck:** `healthcheck.php` faz `GET /up` em 127.0.0.1:8080 (rota interna do Reverb, não exposta). Isso indica apenas que o **processo** está aceitando requisições. O **fluxo completo** (TLS, Traefik, handshake, assinatura de canal, publicação e entrega) é validado pelo `scripts/smoke-test.py`.

## Origens permitidas

O Reverb 1.12 extrai **só o hostname** do cabeçalho `Origin` (`parse_url(..., PHP_URL_HOST)`),
ignorando esquema e porta, e compara cada item com `Str::is` (curinga `*` permitido, por exemplo `*.exemplo.gov.br`).
Uma conexão sem cabeçalho `Origin` é rejeitada (erro 4009).

- `atende-local`: `localhost`, `127.0.0.1` (vale para qualquer porta: `:8000`, `:5173`…)
- `atende-producao`: `atende.prevmoc.mg.gov.br`

Para adicionar um hostname (por exemplo `atende.test`):

```bash
cd /opt/stacks/reverb
sudo python3 -I scripts/generate-secrets.py --add-origin atende-local atende.test
docker compose restart reverb
```

A verificação de origem só limita quais páginas podem abrir conexões. Ela **não** substitui a autorização dos canais privados e de presença.

## Credenciais

Para ver as credenciais (só no terminal, como root):

```bash
sudo python3 -I /opt/stacks/reverb/scripts/show-credentials.py atende-local --env
```

Para adicionar outro sistema no futuro:

```bash
sudo python3 -I scripts/generate-secrets.py --add-app outro-sistema dominio.exemplo.gov.br
docker compose restart reverb
```

Para rotacionar o segredo de uma app, edite `secrets/reverb-apps.json` (mantendo as permissões 0640 root:10001), reinicie e atualize o `.env` do sistema correspondente.

## Operação

```bash
cd /opt/stacks/reverb

docker compose ps                          # status (+ health)
docker compose logs -f --tail=100 reverb   # logs
docker compose restart reverb              # reinício controlado (SIGTERM ordenado)
sudo python3 -I scripts/smoke-test.py      # teste ponta a ponta (17 verificações)
```

### Build e atualização

```bash
cd /opt/stacks/reverb
# (opcional) atualizar dependências dentro das versões fixadas:
#   docker run --rm -v "$PWD/app:/app" -w /app composer:2.10.3 \
#     composer update laravel/reverb --no-scripts --ignore-platform-req=ext-pcntl
# Atualize a tag em docker-compose.yml e no comando abaixo quando mudar versões.
docker build -t local/reverb-server:1.12.0-php8.4.26 app
docker compose up -d reverb                # recria só este container
sudo python3 -I scripts/smoke-test.py
```

O `composer install` roda apenas no build. O container nunca instala pacotes ao iniciar.

### Remover somente este serviço

```bash
cd /opt/stacks/reverb
docker compose down                        # remove só o container reverb (a rede proxy é externa e fica intacta)
docker image rm local/reverb-server:1.12.0-php8.4.26   # opcional
```

`secrets/` permanece no host. Apague o diretório só se quiser descartar as credenciais de vez.

## Portainer

As stacks existentes (traefik, portainer) foram implantadas via Compose CLI em `/opt/stacks/<nome>`.
O Portainer as mostra como stacks externas, com controle "Limited". A stack `reverb` foi implantada do
mesmo jeito e já aparece no Portainer da mesma forma (containers, logs e restart funcionam por lá).

Para transformá-la em stack **gerenciada** pelo Portainer (editável no editor web), sem duplicar containers:

1. Garanta que a imagem `local/reverb-server:1.12.0-php8.4.26` existe no host (`docker image ls local/reverb-server`). O Portainer não faz o build, porque o compose usa `pull_policy: never`.
2. No terminal: `cd /opt/stacks/reverb && docker compose down`. Isso remove o container atual e causa alguns segundos de indisponibilidade. Os segredos ficam intactos.
3. No Portainer: *Stacks → Add stack*, nome **`reverb`**, *Web editor*, e cole o conteúdo de `docker-compose.yml`. Os bind mounts usam caminhos absolutos do host, então funcionam a partir do Portainer. Não é preciso informar variáveis de ambiente.
4. *Deploy the stack* e, em seguida, `sudo python3 -I /opt/stacks/reverb/scripts/smoke-test.py`.
5. A partir daí, atualize pelo Portainer (*Editor → Update the stack*) e deixe de usar `docker compose up` na CLI para esta stack. O build da imagem continua sendo feito na CLI.

## Trocar sslip.io por domínio próprio

1. Crie um registro DNS `A` (por exemplo `ws.seudominio.gov.br → 2.25.227.236`) e espere propagar (`dig +short ws.seudominio.gov.br`).
2. Em `docker-compose.yml`, troque o hostname em `APP_URL`, `REVERB_HOST` e na regra do router. Para uma transição sem corte, use `Host(\`ws.2-25-227-236.sslip.io\`) || Host(\`ws.seudominio.gov.br\`)` com os parênteses envolvendo os Hosts antes do `&&` dos paths.
3. `docker compose up -d reverb`. O Traefik emite o certificado pelo resolver `le` (HTTP-01, porta 80 aberta).
4. `sudo python3 -I scripts/smoke-test.py --host ws.seudominio.gov.br`
5. Atualize `REVERB_HOST` / `VITE_REVERB_HOST` nos sistemas e, por fim, remova o host antigo da regra.

As credenciais e as origens não mudam.

---

# Guia: conectar o projeto Laravel local (atende-local)

> No projeto local você **não** instala nem roda o servidor Reverb (`laravel/reverb`, `reverb:start`).
> O backend só precisa do SDK de publicação compatível com Pusher, e o frontend usa Laravel Echo e pusher-js.

## Configuração aplicada no AtendeJá

- `config/broadcasting.php`: conexão `reverb` habilitada com o driver nativo do Laravel 12; a conexão `pusher` foi preservada.
- `resources/js/echo.js`: Laravel Echo 2 usa `broadcaster: 'reverb'` e as variáveis `VITE_REVERB_*`.
- `.env` local: `BROADCAST_CONNECTION=reverb`, host `ws.2-25-227-236.sslip.io`, porta `443` e esquema `https`, com as credenciais de `atende-local`.
- `.env.example`: configuração de referência sem credenciais. Preencha os três campos `REVERB_APP_*` antes de usar uma nova instalação.

Os SDKs `pusher/pusher-php-server` e `pusher-js` continuam necessários porque o Reverb usa o protocolo Pusher. O pacote `laravel/reverb` já constava nas dependências deste projeto; ele não precisa ser executado localmente. A configuração do servidor em `config/reverb.php` não controla a conexão de saída para a VPS.

Os eventos `SenhaCriada` e `SenhaAtualizada` implementam `ShouldBroadcastNow`: a publicação é imediata e não depende de worker. Os canais `senhas.novas` e `senhas.telao`, os nomes dos eventos e os listeners do guichê e do telão permanecem os mesmos. A rota `/broadcasting/auth` continua no Laravel local.

Depois de alterar o `.env`, execute `php artisan config:clear`. Reinicie `npm run dev` caso esteja em uso, ou execute `npm run build` para gerar os assets. Acesse pelo hostname `localhost` ou `127.0.0.1`, conforme as origens permitidas na VPS. Para conferir o uso no navegador, abra o guichê e o telão, gere uma senha de teste e acompanhe as atualizações ao chamar e atender essa senha.

## 1. Verificar versões

```bash
php artisan --version
composer show laravel/framework pusher/pusher-php-server laravel/reverb 2>/dev/null | grep -E '^(name|versions)'
npm ls laravel-echo pusher-js @laravel/echo-vue @laravel/echo-react
grep -nE "BROADCAST_(DRIVER|CONNECTION)|PUSHER_|REVERB_" .env
grep -rnE "new Echo|configureEcho|broadcaster" resources/js
```

| Situação | O que muda |
|---|---|
| Laravel **11+** | variável `BROADCAST_CONNECTION`, driver nativo `reverb` em `config/broadcasting.php` |
| Laravel **10 ou anterior** | variável `BROADCAST_DRIVER`, e não existe driver `reverb`. Use uma conexão com `'driver' => 'pusher'` apontando para o Reverb (ver 3b) |
| `laravel-echo` **≥ 1.16** (ou 2.x) | `broadcaster: 'reverb'` |
| `laravel-echo` < 1.16 | `broadcaster: 'pusher'` com `wsHost`/`wsPort` (ver 5b), ou atualize o Echo |
| `@laravel/echo-vue` / `@laravel/echo-react` | `configureEcho({ broadcaster: 'reverb', ... })` com as mesmas opções |

## 2. Dependências

Backend (publicação): `pusher/pusher-php-server` (^7.2). Quem já usa Pusher provavelmente já tem.

```bash
composer require pusher/pusher-php-server:^7.2
```

Frontend: `laravel-echo` e `pusher-js` (o Echo usa o protocolo Pusher também com o Reverb).

```bash
npm install --save-dev laravel-echo pusher-js
```

Não rode `php artisan install:broadcasting --reverb` nem `composer require laravel/reverb`, porque eles instalam o servidor. Se o `config/broadcasting.php` ainda não tiver a conexão `reverb`, adicione-a manualmente (3a).

## 3. `config/broadcasting.php`

### 3a. Laravel 11+

```php
'default' => env('BROADCAST_CONNECTION', 'null'),

'connections' => [
    'reverb' => [
        'driver' => 'reverb',
        'key' => env('REVERB_APP_KEY'),
        'secret' => env('REVERB_APP_SECRET'),
        'app_id' => env('REVERB_APP_ID'),
        'options' => [
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT', 443),
            'scheme' => env('REVERB_SCHEME', 'https'),
            'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
        ],
        'client_options' => [
            // Guzzle. NÃO desative a verificação TLS; veja "Certificados" abaixo.
        ],
    ],

    'pusher' => [ /* mantenha como está para poder voltar */ ],
    // ...
],
```

### 3b. Laravel 10 ou anterior (driver pusher apontando para o Reverb)

```php
'default' => env('BROADCAST_DRIVER', 'null'),

'connections' => [
    'reverb' => [
        'driver' => 'pusher',
        'key' => env('REVERB_APP_KEY'),
        'secret' => env('REVERB_APP_SECRET'),
        'app_id' => env('REVERB_APP_ID'),
        'options' => [
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT', 443),
            'scheme' => env('REVERB_SCHEME', 'https'),
            'encrypted' => true,
            'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
        ],
    ],
    // pusher: mantenha
],
```

e use `BROADCAST_DRIVER=reverb` no lugar de `BROADCAST_CONNECTION=reverb`.

## 4. `.env` do projeto local

Pegue os valores reais na VPS com
`sudo python3 -I /opt/stacks/reverb/scripts/show-credentials.py atende-local --env`.

```dotenv
BROADCAST_CONNECTION=reverb          # Laravel ≤10: BROADCAST_DRIVER=reverb

REVERB_APP_ID=<app_id de atende-local>
REVERB_APP_KEY=<key de atende-local>
REVERB_APP_SECRET=<secret de atende-local>   # só no backend
REVERB_HOST=ws.2-25-227-236.sslip.io
REVERB_PORT=443
REVERB_SCHEME=https

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Mantenha as variáveis `PUSHER_*` para poder voltar, mudando apenas `BROADCAST_CONNECTION=pusher`.
**Nunca** coloque `REVERB_APP_SECRET` em uma variável `VITE_*` nem em código do navegador. A *key* é pública, o *secret* não.

## 5. Laravel Echo

### 5a. laravel-echo ≥ 1.16 / 2.x (`resources/js/echo.js` ou `bootstrap.js`)

```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    // authEndpoint padrão: /broadcasting/auth do PRÓPRIO projeto local
});
```

### 5b. Echo antigo (< 1.16)

```js
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    cluster: 'mt1',               // exigido pelo pusher-js, ignorado pelo Reverb
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
});
```

Remova do código JS, se existirem, `cluster` vindo de `VITE_PUSHER_APP_CLUSTER` e referências a `VITE_PUSHER_*`.

## 6. Aplicar

```bash
php artisan config:clear      # ou config:cache se o projeto usa cache de config
php artisan queue:restart     # se houver worker rodando
npm run build                 # ou reinicie o "npm run dev" (as VITE_* são lidas na compilação/início)
php artisan queue:work        # se os eventos forem enfileirados (veja abaixo)
```

- Eventos com `ShouldBroadcast` vão para a **fila do projeto local**. Sem worker (`queue:work`) rodando, nada é publicado. `ShouldBroadcastNow` publica na hora, sem fila. O servidor Reverb não processa filas.
- A página precisa ser aberta em `http://localhost:<porta>` ou `http://127.0.0.1:<porta>`. Outro hostname (por exemplo `atende.test`) é rejeitado com erro 4009 até ser adicionado (seção "Origens permitidas").

## 7. Canais privados e presença

- A autorização continua no projeto local: `routes/channels.php`, `Broadcast::routes()` / `withBroadcasting()` e o endpoint `/broadcasting/auth` **do próprio projeto**. Este servidor não tem e não terá `/broadcasting/auth`.
- A assinatura de autorização é gerada com `REVERB_APP_SECRET`. Por isso a conexão `reverb` precisa estar ativa (o default) também nas requisições de autenticação.
- Nomes de eventos (`broadcastAs`), canais e listeners (`.listen('.Nome')`) continuam iguais.

## 8. Certificados (backend → Reverb)

O backend publica via HTTPS em `ws.2-25-227-236.sslip.io:443`, com certificado Let's Encrypt válido.
Se o PHP local (por exemplo Windows/XAMPP) não tiver bundle de CAs, configure `curl.cainfo` / `openssl.cafile`
no `php.ini` apontando para um `cacert.pem` atualizado. Não use `verify => false`.

## 9. Recursos do Pusher que exigem revisão

| Recurso Pusher | Situação no Reverb 1.12 |
|---|---|
| Canais públicos, `private-`, `presence-`, `cache-` | suportados |
| Eventos de cliente (`whisper` / `client-*`) | suportados. Por padrão só de membros de canais privados/presença (`accept_client_events_from: members`) |
| Batch events, consulta de canais/usuários, terminar conexões de usuário | suportados |
| **Webhooks** (channel_occupied, member_added…) | **não suportados**. Revise se o projeto depende deles |
| **User authentication** (`pusher:signin`, `Echo.connector.pusher.user`, watchlist) | **não suportado** |
| **Canais criptografados** (`private-encrypted-`, `encryptedPrivate`) | sem suporte específico. Teste antes de usar ou evite |
| `cluster`, estatísticas, Debug Console do painel Pusher | não se aplicam |
| Limites | mensagem de até 10 KB (`max_message_size`), sem limite de conexões por app (configurável em `reverb-apps.json`) |
| Pusher Beams (push notifications) | outro produto, sem relação com o Reverb |

## 10. Voltar para o Pusher

`BROADCAST_CONNECTION=pusher`, restaure o Echo antigo, `php artisan config:clear`, `npm run build`, `php artisan queue:restart`.
