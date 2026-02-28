# 📊 Meu Índice de Preços — v2

> Projeto de Extensão — Morrinhos/GO  
> Versão refatorada com template **TailAdmin** — React + TypeScript + Sidebar profissional + Dark Mode.

---

## 🚀 Como Rodar

```bash
npm install
npm run dev -- --port 5174
# Acesse: http://localhost:5174
```

---

## 🗂️ Estrutura

```
v2/
├── src/
│   ├── context/
│   │   ├── AppContext.tsx        ← Estado global (produtos, lista, login)
│   │   ├── SidebarContext.tsx    ← Controle do sidebar colapsável
│   │   └── ThemeContext.tsx      ← Dark/light mode
│   ├── layout/
│   │   ├── AppLayout.tsx         ← Layout raiz com sidebar + header + outlet
│   │   ├── AppHeader.tsx         ← Header com busca, dark mode e perfil
│   │   └── AppSidebar.tsx        ← Sidebar colapsável com 4 itens do projeto
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── PainelAnalises.tsx   ← KPIs, gráfico SVG, tabela, IA
│   │   ├── NovoProduto/
│   │   │   └── NovoProduto.tsx      ← Formulário de cadastro
│   │   ├── ListaCompras/
│   │   │   └── ListaCompras.tsx     ← Busca, quantidades, totais
│   │   ├── Impostos/
│   │   │   └── InfoImpostos.tsx     ← Educação tributária
│   │   └── AuthPages/
│   │       └── SignIn.tsx           ← Login Google simulado
│   ├── App.tsx                  ← Roteamento React Router + ProtectedRoute
│   ├── main.tsx                 ← Entry point com AppProvider + ThemeProvider
│   └── index.css                ← Estilos do TailAdmin + animações customizadas
└── initialProducts.json         ← 211 produtos com alíquotas reais
```

---

## 🧩 Páginas e Rotas

| Página | Rota | Acesso |
|--------|------|--------|
| Login Google | `/signin` | Público |
| Painel e Análises | `/` | 🔒 Protegido |
| Novo Produto | `/add` | 🔒 Protegido |
| Lista de Compras | `/list` | 🔒 Protegido |
| Info Impostos | `/taxes` | 🔒 Protegido |

> Rotas protegidas redirecionam para `/signin` se o usuário não estiver logado.

---

## ✨ Funcionalidades

- **Login Google simulado** — redireciona para `/signin` e protege o app
- **Sidebar TailAdmin** — colapsável, hover para expandir, responsivo mobile
- **Dark Mode** — nativo do TailAdmin, persiste na sessão
- **Estado Global** — `AppContext` compartilha produtos e lista entre páginas
- **Dashboard** — KPIs (total produtos, impostos, mais caro, mais tributado), gráfico SVG, tabela clicável
- **Análise IA** — clique em produto → análise com Google Gemini
- **Importação CSV** — botão no header importa e classifica produtos automaticamente
- **Formulário de Produto** — com seleção visual de tipo de loja e prévia de imposto
- **Lista de Compras** — busca com autocomplete, +/-, totalizador por tributo
- **Info Impostos** — cards com banner amber sobre ICMS, IPI, PIS e COFINS

---

## 🛠️ Stack

| Tecnologia | Versão |
|------------|--------|
| React | 18 |
| TypeScript | 5.7 |
| Vite | 6 |
| Tailwind CSS | 3 (TailAdmin) |
| React Router | 7 |
| Lucide React | latest |
| Google Gemini API | 2.5 Flash |

---

## 🔑 Configurar API Gemini (opcional)

Em `src/pages/Dashboard/PainelAnalises.tsx`, localize:
```ts
const GEMINI_API_KEY = '';
```
Insira sua chave do [Google AI Studio](https://aistudio.google.com/).

Para produção, use variável de ambiente em `.env`:
```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```
E altere para:
```ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
```
