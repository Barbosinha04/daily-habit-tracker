# Daily Habit Tracker - Pro Expansion

Esta é uma versão expandida e profissional do Daily Habit Tracker, migrada de LocalStorage para uma arquitetura cloud-first com **Supabase**.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI Components:** shadcn/ui, Framer Motion, Lucide React
- **Backend/Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Routing:** React Router DOM v6
- **State Management:** Custom Hooks + Optimistic Updates

## Funcionalidades
- [x] **Persistência em Nuvem:** Todos os dados sincronizados via Supabase.
- [x] **Sistema de Abas por Dia:** Visualize hábitos de Segunda a Sábado.
- [x] **Checklist Interativo:** Atualizações otimistas na interface.
- [x] **Realtime:** Mudanças em outros dispositivos refletem instantaneamente.
- [x] **Migração:** Script automático para mover dados do LocalStorage para o Supabase.
- [x] **Design Moderno:** Interface responsiva com suporte a Dark Mode e animações suaves.

## Como Iniciar

### 1. Requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com/)

### 2. Configuração do Banco de Dados
No console do Supabase, execute o script SQL contido em `supabase_schema.sql` no **SQL Editor**. Isso criará as tabelas, índices e políticas de segurança (RLS).

### 3. Configuração de Ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Instalação e Execução
```bash
npm install
npm run dev
```

## Estrutura do Projeto
- `src/services`: Camada de abstração para chamadas à API do Supabase.
- `src/hooks`: Lógica de negócios e gerenciamento de estado encapsulada.
- `src/components/habits`: Componentes específicos da funcionalidade de hábitos.
- `src/utils/migration.helpers.ts`: Lógica para migração de dados antigos.
