# Como Continuar o Projeto em Outra Máquina

## 🚀 Opção 1: Usando Git (Recomendado)

### Pré-requisitos na nova máquina:
1. **Node.js 18+** instalado
2. **pnpm** instalado (`npm install -g pnpm`)
3. **Git** instalado
4. **Editor de código** (VS Code recomendado)

### Passos:

#### 1. Clone o repositório
```bash
# Se você já tem um repositório Git configurado:
git clone [URL_DO_SEU_REPOSITORIO]
cd plataforma-agenda

# OU se ainda não tem um repositório Git:
# Primeiro, crie um repositório no GitHub/GitLab
# Depois clone:
git clone [URL_DO_SEU_REPOSITORIO]
cd plataforma-agenda
```

#### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite o arquivo .env.local com suas configurações
# Use o arquivo INSTRUCOES_SETUP.txt como referência
```

#### 3. Instale as dependências
```bash
# Instale todas as dependências do monorepo
pnpm install
```

#### 4. Configure o banco de dados
```bash
# Execute as migrações
pnpm db:migrate

# Execute os seeds (dados de demonstração)
pnpm db:seed
```

#### 5. Execute o projeto
```bash
# Desenvolvimento
pnpm dev

# OU apenas o frontend
pnpm dev:web

# OU apenas a API
pnpm dev:worker
```

---

## 📦 Opção 2: Backup Manual (Sem Git)

### 1. Faça backup dos arquivos
Copie toda a pasta `plataforma-agenda` para:
- **Pen drive**
- **Google Drive/Dropbox**
- **OneDrive**
- **Email** (compactado)

### 2. Na nova máquina:
```bash
# 1. Instale os pré-requisitos (Node.js, pnpm, Git)
# 2. Cole a pasta do projeto
# 3. Configure o .env.local
# 4. Execute: pnpm install
# 5. Execute: pnpm db:migrate && pnpm db:seed
# 6. Execute: pnpm dev
```

---

## 🔧 Opção 3: Usando Docker (Avançado)

### 1. Crie um Dockerfile
```dockerfile
FROM node:18-alpine

# Instalar pnpm
RUN npm install -g pnpm

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY turbo.json ./

# Copiar workspace packages
COPY packages/ ./packages/
COPY apps/ ./apps/

# Instalar dependências
RUN pnpm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando padrão
CMD ["pnpm", "dev"]
```

### 2. Use Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

---

## 📋 Checklist para Nova Máquina

### ✅ Pré-requisitos
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Git instalado
- [ ] Editor de código (VS Code)

### ✅ Configuração do Projeto
- [ ] Projeto clonado/copiado
- [ ] `.env.local` configurado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Banco configurado (Supabase)
- [ ] Migrações executadas (`pnpm db:migrate`)
- [ ] Seeds executados (`pnpm db:seed`)

### ✅ Serviços Externos
- [ ] Supabase configurado
- [ ] Upstash Redis configurado
- [ ] Resend configurado
- [ ] Cloudflare Workers configurado (se necessário)

### ✅ Teste
- [ ] `pnpm dev` executando
- [ ] Frontend acessível em `http://localhost:3000`
- [ ] API funcionando
- [ ] Banco de dados conectado

---

## 🚨 Problemas Comuns

### Erro: "pnpm command not found"
```bash
npm install -g pnpm
```

### Erro: "Node version incompatible"
```bash
# Instale Node.js 18+ do site oficial
# Ou use nvm:
nvm install 18
nvm use 18
```

### Erro: "Database connection failed"
- Verifique as variáveis no `.env.local`
- Confirme se o Supabase está ativo
- Teste a conexão manualmente

### Erro: "Port already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000
# Mate o processo
kill -9 [PID]
```

---

## 📚 Documentação Útil

### Arquivos importantes:
- `README.md` - Visão geral do projeto
- `INSTRUCOES_SETUP.txt` - Guia completo de setup
- `env.example` - Exemplo de variáveis de ambiente
- `package.json` - Scripts e dependências

### Comandos úteis:
```bash
# Desenvolvimento
pnpm dev              # Tudo
pnpm dev:web          # Apenas frontend
pnpm dev:worker       # Apenas API

# Build
pnpm build            # Tudo
pnpm build:web        # Apenas frontend
pnpm build:worker     # Apenas API

# Testes
pnpm test             # Todos os testes
pnpm test:unit        # Testes unitários
pnpm test:e2e         # Testes E2E

# Banco de dados
pnpm db:migrate       # Executar migrações
pnpm db:seed          # Executar seeds
pnpm db:reset         # Resetar banco

# Qualidade
pnpm lint             # Linting
pnpm type-check       # Verificação de tipos
pnpm format           # Formatação
```

---

## 🎯 Próximos Passos

1. **Escolha uma das opções acima**
2. **Configure o ambiente na nova máquina**
3. **Teste se tudo está funcionando**
4. **Continue o desenvolvimento**:
   - Frontend (`apps/web/`)
   - API (`apps/worker/`)
   - UI Components (`packages/ui/`)

---

## 💡 Dica Importante

**Sempre use Git** para versionar seu código! Isso facilita muito:
- Continuar em outras máquinas
- Fazer backup
- Colaborar com outros desenvolvedores
- Manter histórico de mudanças

Se ainda não tem um repositório Git, crie um agora:
```bash
git init
git add .
git commit -m "Initial commit"
# Depois conecte com GitHub/GitLab
```
