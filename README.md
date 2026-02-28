# 📊 Meu Índice de Preços

> **Projeto de Extensão — Morrinhos/GO**  
> Sistema web de monitoramento de preços e análise de carga tributária de produtos de supermercado e postos de combustível.

---

## 📁 Estrutura do Projeto

```
protótipo do front-end/
├── v1/          ← Versão 1 — Interface própria (React + Tailwind)
├── v2/          ← Versão 2 — Interface TailAdmin (React + TypeScript + Tailwind)
└── README.md    ← Este arquivo
```

---

## 🚀 Sobre as Versões

### v1 — Interface Original
Aplicação React 19 com navegação por abas, temas dinâmicos por seção, animações CSS exclusivas e gráficos SVG nativos. Tela de login simulado Google integrada.

| | |
|---|---|
| **Framework** | React 19 + Vite 7 |
| **Estilização** | Tailwind CSS v4 |
| **Navegação** | Tabs com state (sem React Router) |
| **Gráficos** | SVG nativo |
| **Dark Mode** | ❌ |
| **Porta padrão** | `5173` |

```bash
cd v1
npm install
npm run dev
```

---

### v2 — Interface TailAdmin
Refatoração completa usando o template **TailAdmin**, com sidebar colapsável profissional, React Router, rotas protegidas, dark mode nativo e Context API para estado global.

| | |
|---|---|
| **Framework** | React 18 + Vite 6 + TypeScript |
| **Template** | TailAdmin (Tailwind CSS v3) |
| **Navegação** | React Router DOM — rotas reais |
| **Gráficos** | SVG nativo |
| **Dark Mode** | ✅ nativo |
| **Porta padrão** | `5174` |

```bash
cd v2
npm install
npm run dev -- --port 5174
```

---

## ✨ Funcionalidades (ambas as versões)

| Feature | v1 | v2 |
|---------|----|----|
| Login Google simulado | ✅ | ✅ |
| Dashboard com KPIs | ✅ | ✅ |
| Gráfico de barras SVG | ✅ | ✅ |
| Importação de CSV | ✅ | ✅ |
| Análise com IA Gemini | ✅ | ✅ |
| Novo Produto (formulário) | ✅ | ✅ |
| Lista de Compras | ✅ | ✅ |
| Info Impostos educativo | ✅ | ✅ |
| Temas por aba | ✅ | — |
| Sidebar colapsável | — | ✅ |
| Dark Mode | — | ✅ |
| TypeScript | — | ✅ |
| Rotas reais (URL) | — | ✅ |

---

## 📦 Dados

Os produtos utilizados foram extraídos do arquivo `v1/csv/Calculo_Tributos_Produtos.csv` com **211 produtos** das categorias Alimentos, Bebidas, Carnes, Hortifruti, Higiene, Limpeza e Combustíveis, com alíquotas reais de ICMS, IPI, PIS e COFINS.

---

## 🧾 Impostos Abordados

| Imposto | Tipo | Finalidade |
|---------|------|-----------|
| **ICMS** | Estadual | Circulação de mercadorias |
| **IPI** | Federal | Produtos industrializados |
| **PIS** | Federal | Seguro-desemprego |
| **COFINS** | Federal | Saúde e Previdência Social |

---

## 🛠️ Requisitos

- Node.js 18+
- npm 9+
