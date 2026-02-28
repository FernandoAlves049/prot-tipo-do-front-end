# 📊 Meu Índice de Preços — v1

> Projeto de Extensão — Morrinhos/GO  
> Interface web para monitoramento de preços e análise de carga tributária.

---

## 🚀 Como Rodar

```bash
npm install
npm run dev
# Acesse: http://localhost:5173
```

---

## 🗂️ Estrutura

```
v1/
├── src/
│   ├── App.jsx                  ← Componente raiz + todas as abas
│   ├── Login.jsx                ← Tela de login simulado (Google)
│   ├── TaxesExplanationTab.jsx  ← Aba educativa de impostos
│   ├── index.css                ← Estilos globais + animações
│   ├── main.jsx                 ← Entry point React
│   └── initialProducts.json    ← 211 produtos com alíquotas reais
├── csv/
│   └── Calculo_Tributos_Produtos.csv
└── docs/                        ← Documentação técnica completa
    ├── README.md
    ├── arquitetura.md
    ├── componentes.md
    ├── dados.md
    ├── features.md
    └── api-gemini.md
```

---

## 🧩 Páginas / Abas

| Aba | Rota (state) | Tema | Animação |
|-----|-------------|------|----------|
| Painel e Análises | `dashboard` | 🟢 Emerald | Slide da esquerda |
| Novo Produto | `add` | 🟣 Violet | Slide de baixo |
| Lista de Compras | `list` | 🔵 Sky | Slide da direita |
| Info Impostos | `taxes` | 🟠 Amber | Fade + scale |

---

## ✨ Funcionalidades

- **Login Google simulado** — sem SDK externa, apenas React + CSS
- **Dashboard** — KPI cards, gráfico de barras SVG, gráfico de histórico com predição, tabela de produtos
- **Análise com IA** — integração com a API Google Gemini 2.5 Flash
- **Temas dinâmicos** — paleta de cores muda por aba (header + nav + fundo)
- **Animações exclusivas** — cada aba tem transição CSS própria
- **Importação de CSV** — carrega e classifica produtos automaticamente
- **Novo Produto** — formulário com prévia de impostos em tempo real
- **Lista de Compras** — busca, quantidades e totalizador de impostos
- **Info Impostos** — explicação educativa de ICMS, IPI, PIS e COFINS

---

## 🛠️ Stack

| Tecnologia | Versão |
|------------|--------|
| React | 19 |
| Vite | 7 |
| Tailwind CSS | 4 |
| Lucide React | latest |
| Google Gemini API | 2.5 Flash |

---

## 🔑 Configurar API Gemini (opcional)

Em `src/App.jsx`, localize:
```js
const apiKey = "";
```
Insira sua chave do [Google AI Studio](https://aistudio.google.com/) para ativar a análise por IA.
