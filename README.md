<!-- markdownlint-disable MD033 -->

# 📊 Meu Índice de Preços

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br>

> **Projeto de Extensão Acadêmica — Morrinhos/GO**  
> Plataforma web focada no acompanhamento quinzenal da inflação local e variação do custo de vida da população através do monitoramento de produtos de supermercado.

---

## 📖 Visão Geral

O aumento contínuo no custo de vida afeta incisivamente o poder de compra da população. Índices nacionais como o IPCA muitas vezes não refletem a dinâmica de municípios menores. O **Meu Índice de Preço** surge como uma ferramenta interativa e transparente para trazer dados localizados para a cidade de **Morrinhos-GO**.

A plataforma acompanha as variações reais repassadas a uma cesta padrão (com mais de 30 itens de alto consumo mapeados em cerca de 10 estabelecimentos físicos da cidade).

---

## 🎯 Principais Funcionalidades

O sistema possui fluxos de uso específicos visando tanto a autonomia civil quanto a operação dos pesquisadores (IF Goiano):

### 🧑‍🤝‍🧑 Para o Cidadão (Acesso Público)
- **📈 Painel de Inflação Geral:** Exibição clara via gráficos (SVG interativos) da variação média atual baseada nas coletas quinzenais.
- **🧮 Simulador de Inflação Pessoal:** Calculadora dinâmica em que o cidadão insere seus hábitos reais de consumo (pesos/quantidades) para entender o impacto isolado no seu próprio bolso.
- **✉️ Envio de Feedback:** Formulário simples onde os cidadãos podem sugerir melhorias e relatar seu uso prático da ferramenta.

### 🔐 Para os Pesquisadores (Área Restrita)
- **Login Autenticado:** Proteção SSL para gestão administrativa da plataforma.
- **Gestão de Coletas (Dashboard):** Tela onde a equipe de bolsistas realiza a injeção em lote das pesquisas realizadas presencialmente a cada 15 dias.

---

## 📂 Estrutura do Repositório

Organização unificada para código-fonte, scripts estruturais e documentos de seminário:

```text
meu-indice-precos/
├── apresentacao_html/  ← Seminário (Slides em HTML via Reveal.js e imagens da UI)
├── meu-indice/         ← (Código fonte e refatorações legadas)
├── scripts_extracao/   ← Ferramentas Python de extração de PDF e dados sementes (CSV)
├── v2/                 ← 🚀 APLICAÇÃO PRINCIPAL (React + TS + Tailwind)
└── README.md           ← Este documento
```

---

## 🛠️ Tecnologias Utilizadas

O frontend base (`v2`) foi erguido com o princípio *Mobile-First*, garantindo velocidade e acessibilidade de ponta:
- **Framework & Linguagem:** React 18 acoplado ao TypeScript.
- **Build Tool:** Vite (garantindo carregamento imediato via HMR).
- **Interface e Estilização:** Template profissional *TailAdmin* regido pelo Tailwind CSS.
- **Gráficos:** Renderização via SVG otimizado (ApexCharts).
- **Roteamento:** React Router DOM com proteção e hierarquia de rotas (`/inflacao`, `/simulador`, `/admin`).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js (v18+)** e **npm (v9+)** instalados em sua máquina.

### Passos de Instalação

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/meu-indice-precos.git
```

2. Entre no diretório da aplicação principal (`v2`):
```bash
cd "v2"
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev -- --port 5174
```

A aplicação estará disponível através de **`http://localhost:5174`**. *(O simulador de rotas de backend/fake-API utiliza esta mesma instância)*.

---

## 👥 Equipe Desenvolvedora

Este projeto acadêmico de expansão foi pesquisado, mapeado e desenvolvido por estudantes do **Instituto Federal Goiano — Campus Morrinhos** (4º Período):

- **Fernando Alves de Souza**
- **Felipe Montalvão**
- **Victor Hugo**

---

<div align="center">
  <sub>Construído de Morrinhos para Morrinhos ✨</sub>
</div>
