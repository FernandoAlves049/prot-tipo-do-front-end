# ✨ Features do Sistema

## 1. Login Simulado (Google Sign-In)

### O que é
A primeira tela exibida ao abrir o app é uma simulação da tela de autenticação do **Google**, desenvolvida puramente em React + Tailwind sem nenhuma SDK externa.

![Tela de Login simulando o Google Sign-In](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/login.png)

### Como funciona
```
1. App renderiza: isLoggedIn === false → <Login onLogin={...} />
2. Usuário clica em "Avançar"
3. Login chama onLogin()
4. App seta setIsLoggedIn(true)
5. App agora renderiza o conteúdo principal
```

### Elementos Visuais
- Logo "Google" feita com `<span>` coloridos individualmente:
  - G → `#4285F4` (Azul)
  - o → `#EA4335` (Vermelho)
  - o → `#FBBC05` (Amarelo)
  - g → `#4285F4` (Azul)
  - l → `#34A853` (Verde)
  - e → `#EA4335` (Vermelho)
- Campo de e-mail com estilo Google (borda `#1a73e8` ao focar, border-radius quadrado)
- Botão "Avançar" em `#1a73e8` (azul Google)

> ⚠️ **Atenção:** Não há autenticação real. Qualquer clique em "Avançar" concede acesso.

---

## 2. Temas Dinâmicos por Aba

### O que é
Cada aba do aplicativo tem uma paleta de cores exclusiva que é aplicada dinamicamente ao Header, à barra de navegação e ao fundo da página.

````carousel
![Painel e Análises — tema Emerald (verde)](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/dashboard.png)
<!-- slide -->
![Novo Produto — tema Violet (violeta)](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/add_product.png)
<!-- slide -->
![Lista de Compras — tema Sky (azul)](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/shopping_list.png)
<!-- slide -->
![Info Impostos — tema Amber (âmbar)](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/taxes_tab.png)
````

### Paletas por Aba

| Aba | Cor Principal | Fundo | Header |
|-----|---------------|-------|--------|
| Painel e Análises | 🟢 Emerald | `bg-slate-50` | `bg-slate-900` |
| Novo Produto | 🟣 Violet | `bg-violet-50` | `bg-violet-950` |
| Lista de Compras | 🔵 Sky (Azul Céu) | `bg-sky-50` | `bg-sky-950` |
| Info Impostos | 🟠 Amber | `bg-amber-50` | `bg-amber-950` |

### Implementação

```js
const appThemes = {
  dashboard: {
    appBg: 'bg-slate-50',
    headerBg: 'bg-slate-900',
    navActiveText: 'text-emerald-600',
    navIndicator: 'bg-emerald-600',
    // ...
  },
  add: { /* violet */ },
  list: { /* sky */ },
  taxes: { /* amber */ }
};

const theme = appThemes[activeTab] || appThemes.dashboard;
```

As classes Tailwind do tema são aplicadas dinamicamente:
```jsx
<header className={`... ${theme.headerBg}`}>
<div className={`... ${theme.navIndicator}`}>
<div className={`... ${theme.appBg}`}>
```

Todas as transições usam `transition-colors duration-500` para suavidade.

---

## 3. Animações CSS Exclusivas

### Definidas em `src/index.css`

Cada aba entra com uma animação diferente, criando uma identidade visual única para cada seção:

| Aba | Classe | Efeito | Duração |
|-----|--------|--------|---------|
| Painel e Análises | `animate-slide-in-left` | Desliza da esquerda (+30px → 0) | 500ms |
| Novo Produto | `animate-slide-up` | Sobe de baixo (+30px → 0) | 600ms |
| Lista de Compras | `animate-slide-in-right` | Desliza da direita (+30px → 0) | 500ms |
| Info Impostos | `animate-fade-scale` | Fade + escala (0.95 → 1.0) | 400ms |

### Keyframes

```css
@keyframes slideInLeft {
  0%   { transform: translateX(-30px); opacity: 0; }
  100% { transform: translateX(0);     opacity: 1; }
}

@keyframes slideUp {
  0%   { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}

@keyframes slideInRight {
  0%   { transform: translateX(30px); opacity: 0; }
  100% { transform: translateX(0);    opacity: 1; }
}

@keyframes fadeScale {
  0%   { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1);    opacity: 1; }
}
```

---

## 4. Aba "Info Impostos" — Educação Tributária

### O que é
Uma aba educativa que explica os 4 principais impostos que incidem sobre produtos do cotidiano, de forma acessível ao consumidor comum.

![Aba Info Impostos — topo com banner e card ICMS](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/taxes_tab.png)

![Aba Info Impostos — cards IPI, PIS, COFINS e rodapé](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/taxes_tab_bottom.png)

### Conteúdo dos Impostos

| Imposto | Nome Completo | Esfera | Finalidade |
|---------|--------------|--------|------------|
| **ICMS** | Imposto sobre Circulação de Mercadorias e Serviços | Estadual | Cada estado define sua alíquota |
| **IPI** | Imposto sobre Produtos Industrializados | Federal | Incide sobre produtos beneficiados industrialmente |
| **PIS** | Programa de Integração Social | Federal | Custeia Seguro-Desemprego e Abono Salarial |
| **COFINS** | Contribuição para o Financiamento da Seguridade Social | Federal | Financia SUS, Previdência e Assistência Social |

---

## 5. Importação de CSV

### Como funciona
O botão **"Importar Produtos (CSV)"** no header abre um seletor de arquivo. O CSV deve seguir o formato do arquivo `Calculo_Tributos_Produtos.csv`.

![Botão de importação CSV no header do Dashboard](file:///d:/if%204%C2%BA%20periodo/prot%C3%B3tipo%20do%20front-end/meu-indice/docs/images/dashboard.png)

### Processamento

1. O arquivo é lido via `FileReader` como texto
2. As linhas são separadas por `\n`
3. As colunas são extraídas por vírgula
4. O nome do produto é classificado em categoria por palavras-chave
5. Combustíveis são atribuídos ao `storeType: 'posto'`, demais ao `'supermercado'`
6. O histórico de preços é gerado: `[90%, 95%, 98%, 100%]` do preço atual
7. `setProducts(newProducts)` atualiza o estado global

---

## 6. Análise com IA (Gemini)

### Como funciona
No Dashboard, ao selecionar um produto, aparece o botão **"Explicar com I.A."**. Ao clicar, o sistema monta um prompt contextual e envia para a API Gemini.

### Exemplo de Prompt Gerado

```
Explique de forma simples e educativa, em português, como os impostos 
funcionam para o produto "Arroz Vasconcelos" que custa R$ 28,50. 
Este produto tem os seguintes impostos embutidos no preço: 
ICMS: 7%, IPI: 0%, PIS: 0.165%, COFINS: 0.76%.
```

Veja mais detalhes em [api-gemini.md](./api-gemini.md).

---

## 7. Dashboard — Gráficos SVG

### Gráfico de Barras
Compara o **preço bruto** vs o **valor do imposto** de cada produto filtrado, desenhado diretamente como SVG sem dependências externas.

### Gráfico de Linhas com Predição
Exibe o histórico de preços dos últimos 4 registros e um ponto de **predição futura** calculado pela tendência da série histórica. A linha de predição é pontilhada e colorida diferente para indicar que é uma estimativa.
