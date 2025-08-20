# Plataforma de Agendamento - SaaS Multi-setor

SaaS de agendamento multi-setor (barbearia, clínica, estúdio, oficina, pet, etc.) com MVP 100% funcional usando apenas tiers grátis.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14+ (App Router) + Tailwind CSS
- **Backend**: Cloudflare Workers + Hono
- **Banco de Dados**: Supabase (PostgreSQL + Auth)
- **Cache**: Upstash Redis
- **E-mail**: Resend
- **Deploy**: Vercel (Frontend) + Cloudflare Workers (API)
- **Pagamentos**: Mercado Pago/Stripe (opcional)

## 📁 Estrutura do Projeto

```
plataforma-agenda/
├── apps/
│   ├── web/                 # Next.js App (Painel + Booking Público)
│   └── worker/              # Cloudflare Workers (API + Cron)
├── packages/
│   ├── core/                # SDK compartilhado
│   └── ui/                  # Componentes UI
├── database/
│   ├── migrations/          # Migrações SQL
│   └── seeds/               # Dados iniciais
└── docs/                    # Documentação
```

## 🛠️ Setup Local

### Pré-requisitos

- Node.js 18+
- pnpm
- Conta no Supabase
- Conta no Vercel
- Conta no Cloudflare
- Conta no Upstash
- Conta no Resend

### 1. Clone e Instalação

```bash
git clone <seu-repo>
cd plataforma-agenda
pnpm install
```

### 2. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL em `database/migrations/`
3. Configure as políticas RLS
4. Execute os seeds em `database/seeds/`

### 3. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```bash
# Supabase
DATABASE_URL=sua_url_do_supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=sua_url_redis
UPSTASH_REDIS_REST_TOKEN=seu_token_redis

# E-mail (Resend)
RESEND_API_KEY=sua_chave_resend

# App
APP_BASE_URL=http://localhost:3000
TIMEZONE=America/Sao_Paulo
DEFAULT_LOCALE=pt-BR
```

### 4. Desenvolvimento Local

```bash
# Terminal 1 - Frontend
pnpm dev:web

# Terminal 2 - Worker (API)
pnpm dev:worker

# Terminal 3 - Build e watch
pnpm build:watch
```

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### API (Cloudflare Workers)

1. Instale Wrangler CLI: `npm i -g wrangler`
2. Configure `wrangler.toml`
3. Deploy: `wrangler deploy`

### Banco de Dados (Supabase)

1. Execute migrações via SQL Editor
2. Configure políticas RLS
3. Execute seeds

## 📋 Funcionalidades

- ✅ Multi-tenant com RLS
- ✅ CRUD de unidades, profissionais, serviços
- ✅ Agenda por profissional
- ✅ Booking público
- ✅ Lembretes por e-mail
- ✅ Relatórios e export CSV
- ✅ Cache Redis para disponibilidade
- ✅ Autenticação Supabase
- ✅ PWA para booking público

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Todos os serviços
pnpm dev:web          # Apenas frontend
pnpm dev:worker       # Apenas API

# Build
pnpm build            # Build completo
pnpm build:web        # Build frontend
pnpm build:worker     # Build API

# Testes
pnpm test             # Todos os testes
pnpm test:unit        # Testes unitários
pnpm test:e2e         # Testes E2E

# Lint e Type Check
pnpm lint             # ESLint
pnpm type-check       # TypeScript
```

## 📊 Estrutura do Banco

- **tenants**: Empresas/negócios
- **units**: Unidades/filiais
- **users**: Usuários do sistema
- **professionals**: Profissionais
- **customers**: Clientes
- **services**: Serviços oferecidos
- **appointments**: Agendamentos
- **schedule_rules**: Regras de horário
- **time_off**: Folgas/bloqueios
- **notifications**: Notificações

## 🔐 Segurança

- RLS (Row Level Security) por tenant_id
- JWT com refresh tokens
- Rate limiting em rotas públicas
- Validação com Zod
- Idempotency keys

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para o mercado brasileiro**
