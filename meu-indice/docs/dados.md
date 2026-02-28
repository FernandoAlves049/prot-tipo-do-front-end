# 📦 Modelo de Dados

## Estrutura de um Produto

Cada produto no sistema segue a interface abaixo:

```typescript
interface Product {
  id: number;             // Identificador único
  name: string;           // Nome do produto (ex: "Arroz Vasconcelos")
  category: string;       // Categoria (ver lista abaixo)
  storeType: 'supermercado' | 'posto'; // Tipo de estabelecimento
  price: number;          // Preço atual em R$
  taxes: {
    icms: number;         // Alíquota ICMS (ex: 0.07 = 7%)
    ipi: number;          // Alíquota IPI
    pis: number;          // Alíquota PIS
    cofins: number;       // Alíquota COFINS
  };
  history: number[];      // Array com os 4 últimos preços registrados
}
```

### Exemplo de Produto

```json
{
  "id": 1,
  "name": "Arroz Vasconcelos",
  "category": "Alimentos",
  "storeType": "supermercado",
  "price": 28.50,
  "taxes": {
    "icms": 0.07,
    "ipi": 0,
    "pis": 0.00165,
    "cofins": 0.0076
  },
  "history": [25.65, 27.07, 27.93, 28.50]
}
```

---

## Categorias

### Supermercado (`storeType: 'supermercado'`)

| Categoria | Exemplos de Produtos |
|-----------|---------------------|
| `Alimentos` | Arroz, feijão, açúcar, farinha, macarrão, pão, leite |
| `Bebidas` | Cerveja, refrigerante, suco, água |
| `Carnes` | Frango, carne bovina, suína, embutidos |
| `Hortifruti` | Tomate, banana, cenoura, alface, batata |
| `Higiene` | Shampoo, sabonete, papel higiênico, desodorante |
| `Limpeza` | Sabão em pó, detergente, água sanitária, amaciante |
| `Outros` | Produtos que não se encaixam nas categorias acima |

### Posto (`storeType: 'posto'`)

| Categoria | Exemplos de Produtos |
|-----------|---------------------|
| `Combustíveis` | Gasolina, etanol, diesel, bujão de gás |
| `Outros` | Demais itens de conveniência |

---

## Origem dos Dados

### Dados Iniciais
Os dados de produtos iniciais foram extraídos do arquivo `Calculo_Tributos_Produtos.csv` (localizado em `csv/`) e convertidos para o arquivo `src/initialProducts.json`.

O CSV original contém **211 produtos** nas seguintes colunas:

| Coluna | Descrição |
|--------|-----------|
| `cols[0]` | ID interno |
| `cols[1]` | Nome do produto |
| `cols[2]` | Preço (R$) |
| `cols[3]` | Alíquota ICMS (%) |
| `cols[5]` | Alíquota PIS (%) |
| `cols[7]` | Alíquota COFINS (%) |
| `cols[9]` | Alíquota IPI (%) |

### Classificação Automática via Importação CSV

Ao importar um CSV pelo botão **"Importar Produtos"**, o sistema classifica automaticamente cada produto por:

1. **Categoria** — por palavras-chave no nome (ex: "arroz" → "Alimentos")
2. **Tipo de Loja** — `Combustíveis` → `posto`, todos os outros → `supermercado`

O histórico de preços é gerado sinteticamente como:
```js
history: [price * 0.90, price * 0.95, price * 0.98, price]
```

---

## Item da Lista de Compras

```typescript
interface ShoppingItem {
  product: Product;  // Referência ao produto
  quantity: number;  // Quantidade adicionada
}
```

### Cálculo dos Totais

```js
const totalPrice = shoppingList.reduce(
  (sum, item) => sum + item.product.price * item.quantity, 0
);

const totalTax = shoppingList.reduce((sum, item) => {
  const { icms, ipi, pis, cofins } = item.product.taxes;
  return sum + (icms + ipi + pis + cofins) * item.product.price * item.quantity;
}, 0);
```

---

## Alíquotas Típicas por Categoria

| Categoria | ICMS | IPI | PIS | COFINS |
|-----------|------|-----|-----|--------|
| Alimentos básicos | 7% | 0% | 0,165% | 0,76% |
| Bebidas alcoólicas | 21% | 15% | 1,65% | 7,6% |
| Produtos processados | 19% | 0% | 1,65% | 7,6% |
| Combustíveis | 25% | 0% | 3% | 10% |
