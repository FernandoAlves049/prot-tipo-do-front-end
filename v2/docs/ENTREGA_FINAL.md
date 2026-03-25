# Documentação de Entrega do Projeto

Este documento contém todo o material solicitado para a entrega final do projeto.

---

## 1. Conteúdo para Slides / Seminário

**Título:** Sistema de Gestão Inteligente: Compras, Impostos e Projetos  
**Equipe:** [Nomes dos Membros]  
**Data:** 25/03/2026

### Slide 1: Introdução / Problema
- Dificuldade em gerenciar múltiplos aspectos (compras, carga tributária e projetos) em plataformas separadas.
- Falta de visibilidade unificada de tarefas e custos.
- Necessidade de uma interface moderna, responsiva e intuitiva.

### Slide 2: A Solução
- Uma aplicação Web Integrada (SPA) desenvolvida com React e Vite.
- Módulos centrais:
    1.  **Dashboard Analítico**: Visão geral de métricas.
    2.  **Gestão de Compras**: Cadastro de produtos e listas.
    3.  **Inteligência Tributária**: Consulta e cálculo de impostos.
    4.  **Gerenciamento de Projetos**: Tarefas, equipe e financeiro.

### Slide 3: Tecnologias Utilizadas
- **Frontend**: React (TypeScript), Vite.
- **Estilização**: Tailwind CSS (Utility-first).
- **Gráficos**: ApexCharts para visualização de dados.
- **Roteamento**: React Router v6.
- **Controle de Estado**: React Context API.

### Slide 4: Principais Funcionalidades (Demo)
- **Login Seguro**: Autenticação de usuário.
- **Painel Interativo**: Gráficos de vendas e metas mensais.
- **Módulo de Projetos**: Kanban de tarefas, gestão de profissionais e fluxo financeiro.

### Slide 5: Conclusão
- O protótipo atende aos requisitos de usabilidade e integração.
- Arquitetura escalável e pronta para integração com Backend.
- Interface otimizada para produtividade do usuário final.

---

## 2. Estrutura do Trabalho Escrito (Template Artigo SBC)

**Título:** Desenvolvimento de um Frontend Modular para Gestão Integrada de Recursos e Projetos

**Resumo:** Este artigo descreve o desenvolvimento do frontend de uma aplicação web voltada para a gestão de compras, impostos e projetos. Utilizando React, TypeScript e Tailwind CSS, foi construída uma interface responsiva e modular que visa melhorar a experiência do usuário na administração de recursos empresariais.

**1. Introdução**
   - Contextualização sobre a importância de sistemas ERP e de gestão.
   - Objetivos do trabalho: criar um protótipo funcional e responsivo.

**2. Fundamentação Teórica / Tecnologias**
   - **React.js**: Biblioteca base para componentes reativos.
   - **Vite**: Ferramenta de build para performance e HMR.
   - **Tailwind CSS**: Framework de CSS utilitário para agilidade no design system.

**3. Arquitetura do Sistema**
   - Organização de pastas (Components, Pages, Context, Hooks).
   - Fluxo de navegação (React Router) e rotas protegidas (`ProtectedRoute`).
   - Gerenciamento de Estado Global com Context API (Auth, Theme, Sidebar).

**4. Resultados**
   - Apresentação das telas desenvolvidas:
     - Dashboard de Análises.
     - Módulo de Projetos (Tarefas, Financeiro).
     - Lista de Compras.
   - Análise de responsividade e desempenho (Lighthouse).

**5. Conclusão**
   - O uso de Tailwind acelerou o desenvolvimento da UI.
   - A estrutura modular facilita a manutenção e futura expansão.

---

## 3. Relacionamento IU com Casos de Uso

| Caso de Uso (UC) | Interface de Usuário (Tela/Componente) | Descrição |
| :--- | :--- | :--- |
| **UC01 - Autenticar Usuário** | `SignIn.tsx` | Tela de login com campos de e-mail e senha. |
| **UC02 - Visualizar Metas** | `PainelAnalises.tsx` | Dashboard com gráficos de vendas e estatísticas. |
| **UC03 - Cadastrar Produto** | `NovoProduto.tsx` | Formulário para inserção de novos itens no sistema. |
| **UC04 - Listar Compras** | `ListaCompras.tsx` | Tabela interativa com produtos e status de compra. |
| **UC05 - Consultar Impostos** | `InfoImpostos.tsx` | Tela informativa com dados tributários. |
| **UC06 - Gerenciar Projeto** | `ProjectManagement.tsx` | Visão geral dos projetos ativos. |
| **UC07 - Alocar Profissionais** | `ProfessionalManagement.tsx` | Lista de membros da equipe e atribuições. |
| **UC08 - Rastrear Tarefas** | `TaskTracking.tsx` | Quadro de tarefas e status de execução. |
| **UC09 - Gerir Financeiro** | `ProjectFinances.tsx` | Relatórios de custos e orçamento do projeto. |

---

## 4. Tarefas e Horas Gastas por Profissional

Estimativa baseada na complexidade de cada módulo, considerando desenvolvimento, testes e ajustes.

| Módulo / Tarefa | Perfil Profissional | Horas Estimadas | Atividade Principal |
| :--- | :--- | :--- | :--- |
| **Configuração do Projeto** | Sênior | 4h | Setup Vite, TypeScript, Eslint, Tailwind. |
| **Arquitetura de Rotas/Context** | Sênior | 6h | React Router, Context API (Auth/Theme). |
| **Tela de Login (Auth)** | Pleno | 4h | Lógica de validação e integração fake-api. |
| **Tela de Login (UI)** | Júnior | 4h | Estilização do formulário e responsividade. |
| **Componentes Base (UI Kit)** | Júnior | 16h | Botões, Inputs, Cards, Badges, Modais. |
| **Dashboard (Gráficos)** | Pleno | 8h | Implementação do ApexCharts e dados mocks. |
| **Dashboard (Layout)** | Júnior | 6h | Grid layout e posicionamento dos cards. |
| **Módulo Projetos (Lógica)** | Pleno | 12h | CRUD (mock) de tarefas e gestão de estado. |
| **Módulo Projetos (Telas)** | Júnior | 16h | Telas de Tarefas, Financeiro e Equipe. |
| **Telas de Compras/Produtos** | Júnior | 10h | Tabelas e formulários. |
| **Refatoração e Review** | Sênior | 6h | Code review e otimização de performance. |

**Resumo de Horas:**
- **Sênior:** 16 horas
- **Pleno:** 24 horas
- **Júnior:** 52 horas
- **Total do Projeto:** 92 horas

---

## 5. Profissionais e Papéis na Equipe

### **Desenvolvedor Frontend Júnior**
- **Responsabilidades:** Implementação de layouts a partir de protótipos (Figma), criação de componentes de UI estáticos (Botões, Inputs), estilização com Tailwind CSS, correção de bugs visuais simples.
- **Foco:** HTML, CSS (Tailwind), React Básico (JSX/TSX).

### **Desenvolvedor Frontend Pleno**
- **Responsabilidades:** Lógica de negócio no cliente, integração de validação de formulários, gerenciamento de estado local e global (Context API/Redux), configuração de gráficos (ApexCharts), implementação de fluxos de autenticação.
- **Foco:** React Hooks, TypeScript Avançado, Lógica de Programação, Integração de APIs.

### **Desenvolvedor Frontend Sênior / Tech Lead**
- **Responsabilidades:** Definição da arquitetura do projeto (estrutura de pastas, padrões de código), configuração do ambiente de build (Vite/Webpack), Code Reviews, decisões sobre bibliotecas (React Router, ApexCharts), mentoria da equipe, configuração de CI/CD.
- **Foco:** Arquitetura de Software, Performance, Segurança, Boas Práticas (SOLID, Clean Code).

---

## 6. Recursos Tecnológicos

### **Hardware**
- Estações de trabalho (Notebooks/Desktops) com no mínimo 16GB RAM (recomendado para rodar Node.js e Docker se necessário).

### **Software & Ferramentas**
- **IDE:** Visual Studio Code (com extensões: ES7+, Tailwind CSS IntelliSense, Prettier).
- **Linguagem:** TypeScript (v5+).
- **Framework:** React.js (v18+).
- **Build Tool:** Vite.
- **Estilização:** Tailwind CSS.
- **Controle de Versão:** Git & GitHub/GitLab.
- **Design/Prototipagem:** Figma.
- **Gerenciamento de Pacotes:** NPM ou Yarn.

---

## 7. Definição de Preço do Projeto

O preço é calculado com base nas horas estimadas e no valor hora de mercado (exemplo base Brasil).

| Profissional | Valor Hora (R$) | Horas Alocadas | Custo Total (R$) |
| :--- | :--- | :--- | :--- |
| **Sênior** | R$ 150,00 | 16h | R$ 2.400,00 |
| **Pleno** | R$ 90,00 | 24h | R$ 2.160,00 |
| **Júnior** | R$ 50,00 | 52h | R$ 2.600,00 |
| **Infraestrutura/Custos Fixos** | - | - | R$ 1.500,00 |
| **Lucro/Margem (20%)** | - | - | R$ 1.732,00 |

### **Preço Final Sugerido:** **R$ 10.392,00**
