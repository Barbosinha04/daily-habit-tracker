# Daily Habit Tracker - Pro Expansion

Esta é uma versão avançada e profissional de um rastreador de hábitos, migrada de LocalStorage para uma arquitetura cloud-first com **Supabase**. O sistema foca em disciplina de longo prazo, com recursos de histórico imutável e acompanhamento de supermetas.

## 🚀 Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
* **UI Components:** shadcn/ui, Framer Motion, Lucide React
* **Backend/Database:** Supabase (PostgreSQL)
* **State Management:** Custom Hooks + Otimização de UI

## ✨ Funcionalidades Principais

* ☁️ **Persistência em Nuvem:** Todos os dados são sincronizados e seguros via Supabase.
* 📅 **Sistema de Abas por Dia:** Visualize sua rotina organizada por dias da semana (Segunda a Sábado).
* 🔒 **Histórico Imutável:** Dias passados tornam-se "somente leitura" (read-only). O que não foi feito é marcado como falha, garantindo auto-responsabilidade.
* 🎯 **Supermetas (Super Goals):** Uma área dedicada para rastrear objetivos de médio/longo prazo (ex: "Shape em 60 dias"), com barra de progresso baseada em um número alvo de execuções.
* 🎨 **Design Moderno:** Interface minimalista, responsiva e focada em Dark Mode.

## 🛠️ Como Iniciar

### 1. Requisitos
* Node.js 18+
* Conta no [Supabase](https://supabase.com/)

### 2. Configuração do Banco de Dados
No painel do Supabase, vá até o **SQL Editor** e execute os dois scripts de criação de tabelas encontrados na raiz do projeto:
1. `supabase_schema.sql` (Cria a estrutura de hábitos e logs diários).
2. `super_goals_schema.sql` (Cria a estrutura para o acompanhamento das Supermetas).

### 3. Configuração de Ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`. Preencha com as suas chaves do Supabase:
```env
VITE_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
4. Instalação e Execução
Bash
npm install
npm run dev
