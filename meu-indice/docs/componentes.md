# 🧩 Componentes

## Mapa de Componentes

```
App (export default)
├── Login                    ← src/Login.jsx
├── Header                   ← definido dentro de App.jsx
├── Navigation               ← definido dentro de App.jsx
├── DashboardTab             ← definido dentro de App.jsx
│   └── Card                 ← helper local
├── AddProductTab            ← definido dentro de App.jsx
├── ShoppingListTab          ← definido dentro de App.jsx
└── TaxesExplanationTab      ← src/TaxesExplanationTab.jsx
```

---

## `App` — Componente Raiz

**Arquivo:** `src/App.jsx`  
**Exportação:** `export default function App()`

O componente principal que controla toda a aplicação. Renderiza condicionalmente o Login ou o conteúdo principal.

### Lógica de Renderização

```jsx
if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

return (
  <div className={`... ${theme.appBg}`}>
    <Header />
    <Navigation />
    <main>
      {activeTab === 'dashboard' && <div className="animate-slide-in-left"><DashboardTab /></div>}
      {activeTab === 'add'       && <div className="animate-slide-up"><AddProductTab /></div>}
      {activeTab === 'list'      && <div className="animate-slide-in-right"><ShoppingListTab /></div>}
      {activeTab === 'taxes'     && <div className="animate-fade-scale"><TaxesExplanationTab /></div>}
    </main>
  </div>
);
```

---

## `Login`

**Arquivo:** `src/Login.jsx`  
**Props:** `onLogin: () => void`

Tela de autenticação simulada inspirada na interface do Google Sign-In.

![Componente Login](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/login.png)

### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `onLogin` | `() => void` | Callback chamado ao clicar em "Avançar" |

### Elementos Visuais

- Logo colorida **Google** com as 4 cores oficiais (`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`)
- Campo de e-mail (decorativo — sem validação real)
- Links "Esqueceu seu e-mail?" e "Criar conta" (decorativos)
- Botão **Avançar** (`#1a73e8`) que dispara `onLogin`
- Animação de entrada: `animate-fade-scale`

---

## `Header`

**Definido em:** `src/App.jsx` (linha ~4188)  
**Tipo:** Componente interno sem props (acessa state via closure)

Cabeçalho fixo no topo da tela com o nome do app e botão de importação de CSV.

### Elementos

- Ícone `TrendingUp` com cor do tema ativo
- Título: **"Meu Índice de Preços"**
- Subtítulo: *"Projeto de Extensão - Morrinhos/GO"*
- Botão **"Importar Produtos (CSV)"** que abre o seletor de arquivo
- Fundo muda dinamicamente com `theme.headerBg` (dark/slate/violet/sky/amber)

---

## `Navigation`

**Definido em:** `src/App.jsx` (linha ~4215)  
**Tipo:** Componente interno sem props

Barra de navegação flutuante com as 4 abas do aplicativo.

### Abas

| ID | Label | Ícone |
|----|-------|-------|
| `dashboard` | Painel e Análises | `BarChart3` |
| `add` | Novo Produto | `PlusCircle` |
| `list` | Lista de Compras | `ShoppingCart` |
| `taxes` | Info Impostos | `BookOpen` |

### Comportamento

- A aba ativa recebe `theme.navActiveText` + `theme.navActiveBg`
- Um indicador colorido (linha fina) aparece na base da aba ativa
- Ao trocar de aba, chama `setActiveTab(tab.id)`

---

## `DashboardTab`

**Definido em:** `src/App.jsx` (linha ~4242)  
**Tipo:** Componente interno sem props — o mais complexo do projeto

Módulo de análise e visualização com gráficos SVG, KPIs, filtros e integração com IA.

````carousel
![DashboardTab — modo Supermercado com tema Emerald](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/dashboard.png)
<!-- slide -->
![DashboardTab — modo Posto de Combustível com tema escuro](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/dashboard_posto.png)
````

### States Internos

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `activeStore` | `'supermercado' \| 'posto'` | Tipo de loja exibida |
| `selectedCategory` | `string` | Filtro de categoria ativo |
| `dashSearch` | `string` | Texto de busca |
| `selectedProduct` | `Product \| null` | Produto selecionado para análise |
| `aiExplanation` | `string` | Resposta da IA Gemini |
| `isExplaining` | `boolean` | Loading state da IA |

### Funcionalidades

- **Toggle Supermercado / Posto:** Alterna entre os dois tipos de loja com transição de tema
- **Filtro por Categoria:** Dropdown que lista categorias disponíveis
- **Busca de Produtos:** Campo de texto que filtra em tempo real
- **Cards de KPI:** Total gasto, Imposto total, Produto mais caro, Mais tributado
- **Gráfico de Barras (SVG):** Comparativo de preço bruto vs imposto por produto
- **Gráfico de Linhas (SVG):** Histórico de preços + predição futura
- **Análise com IA:** Botão "Explicar com I.A." que consulta o Gemini

---

## `AddProductTab`

**Definido em:** `src/App.jsx`  
**Tipo:** Componente interno sem props

Formulário para cadastrar novos produtos manualmente no banco de dados da sessão.

![AddProductTab — formulário de cadastro com tema Violet](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/add_product.png)

### Campos do Formulário

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome do produto | Texto | ✅ |
| Categoria | Select | ✅ |
| Tipo de loja | Select (`supermercado` / `posto`) | ✅ |
| Preço (R$) | Número | ✅ |
| Alíquota ICMS (%) | Número | ✅ |
| Alíquota IPI (%) | Número | ✅ |
| Alíquota PIS (%) | Número | ✅ |
| Alíquota COFINS (%) | Número | ✅ |

### Comportamento

- Ao submeter, chama `setProducts(prev => [...prev, newProduct])`
- Gera um `id` único com `Date.now()`
- Calcula histórico sintético: `[price * 0.9, price * 0.95, price * 0.98, price]`
- Exibe prévia dos impostos calculados em tempo real

---

## `ShoppingListTab`

**Definido em:** `src/App.jsx`  
**Tipo:** Componente interno sem props

Módulo de lista de compras com busca de produtos e cálculo de totais tributários.

![ShoppingListTab — lista de compras com tema Sky](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/shopping_list.png)

### Funcionalidades

- **Busca de Produtos:** Encontra produtos do banco de dados para adicionar à lista
- **Gerenciar Quantidade:** Botões `+` / `-` para ajustar a quantidade de cada item
- **Remover Item:** Ícone de lixeira para remover da lista
- **Totais:** Calcula preço total, imposto total (ICMS + IPI + PIS + COFINS) e breakdown por tributo
- **Estado vazio:** Exibe ilustração quando a lista está vazia

---

## `TaxesExplanationTab`

**Arquivo:** `src/TaxesExplanationTab.jsx`  
**Tipo:** Componente independente sem props

Aba educativa que explica os principais impostos brasileiros de forma simples e visual.

![TaxesExplanationTab — cards de educação tributária com tema Amber](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/taxes_tab.png)

### Estrutura

1. **Banner Amber** — introdução com ícone de livro e texto explicativo
2. **Grid de Cards 2x2** — um card para cada imposto:
   - **ICMS** (Indigo) — Imposto estadual sobre circulação de mercadorias
   - **IPI** (Teal) — Imposto federal sobre produtos industrializados
   - **PIS** (Cyan) — Contribuição federal para seguro-desemprego
   - **COFINS** (Blue) — Contribuição federal para seguridade social
3. **Rodapé Informativo** — explica o conceito de "Carga Tributária"

### Estrutura de Dados Interna

```js
const taxesVars = [
  { id, name, fullName, color, lightColor, icon, desc }
]
```

---

## `Card`

**Definido em:** `src/App.jsx` (linha ~4067)  
**Tipo:** Componente utilitário

Wrapper simples para criar cards estilizados com `rounded-2xl`, `shadow-sm`, e `border`.

```jsx
const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${className}`}>
    {children}
  </div>
);
```
