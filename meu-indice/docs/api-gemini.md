# 🤖 Integração com a API Gemini

## Visão Geral

O aplicativo integra a **API Google Gemini** (modelo `gemini-2.5-flash-preview`) para fornecer explicações contextuais sobre impostos de produtos específicos, tornando os dados tributários mais acessíveis ao usuário comum.

---

## Configuração

A chave de API é definida como constante no topo de `src/App.jsx`:

```js
const apiKey = ""; // Inserir a chave aqui
```

> ⚠️ **IMPORTANTE:** Nunca commite a chave de API no repositório! Adicione-a via variável de ambiente em produção.

### Endpoint Utilizado

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={apiKey}
```

---

## Função `fetchGeminiWithRetry`

```js
const fetchGeminiWithRetry = async (prompt, retries = 5) => {
  const url = `https://...?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  let delay = 1000;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Falha na resposta da API');

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text
        || "Não foi possível gerar uma resposta.";

    } catch (error) {
      if (i === retries - 1)
        return "⚠️ Ocorreu um erro ao comunicar com a IA.";

      await new Promise(res => setTimeout(res, delay));
      delay *= 2; // Backoff exponencial
    }
  }
};
```

### Parâmetros

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `prompt` | `string` | — | Prompt completo para o modelo |
| `retries` | `number` | `5` | Tentativas em caso de falha |

### Retry com Backoff Exponencial

- **Tentativa 1:** falhou → aguarda 1s
- **Tentativa 2:** falhou → aguarda 2s
- **Tentativa 3:** falhou → aguarda 4s
- **Tentativa 4:** falhou → aguarda 8s
- **Tentativa 5:** falhou → retorna mensagem de erro

---

## Como o Prompt é Montado

No componente `DashboardTab`, quando o usuário seleciona um produto e clica em **"Explicar com I.A."**:

```js
const handleExplainWithAI = async (product) => {
  setIsExplaining(true);
  setAiExplanation('');

  const totalTaxPercent = (
    (product.taxes.icms + product.taxes.ipi + product.taxes.pis + product.taxes.cofins) * 100
  ).toFixed(2);

  const prompt = `
    Explique de forma simples e educativa, em português, como os impostos 
    funcionam para o produto "${product.name}" que custa R$ ${product.price.toFixed(2)}. 
    Este produto tem os seguintes impostos embutidos no preço: 
    ICMS: ${(product.taxes.icms * 100).toFixed(2)}%, 
    IPI: ${(product.taxes.ipi * 100).toFixed(2)}%, 
    PIS: ${(product.taxes.pis * 100).toFixed(2)}%, 
    COFINS: ${(product.taxes.cofins * 100).toFixed(2)}%.
    A carga tributária total é de ${totalTaxPercent}%.
    Explique o que cada imposto significa para o consumidor comum 
    e quanto do preço final é imposto em valores absolutos.
  `;

  const explanation = await fetchGeminiWithRetry(prompt);
  setAiExplanation(explanation);
  setIsExplaining(false);
};
```

---

## Estados de UI Durante a Chamada

| Estado | Descrição | UI |
|--------|-----------|-----|
| `isExplaining = true` | Aguardando resposta | Exibe spinner `Loader2` + texto "Consultando I.A..." |
| `aiExplanation = ''` | Sem resposta ainda | Campo da IA oculto |
| `aiExplanation = '...'` | Resposta recebida | Card com o texto da explicação |

---

## Limitações Conhecidas

| Limitação | Impacto | Solução Recomendada |
|-----------|---------|---------------------|
| Chave de API exposta no frontend | Risco de abuso/roubo da chave | Mover para um proxy backend (ex: Cloud Function) |
| Sem cache das respostas | Mesma pergunta gera múltiplas chamadas à API | Implementar cache por `product.id` |
| Sem streaming | Resposta só aparece completa | Implementar `streamGenerateContent` da API |
| Rate limiting não tratado explicitamente | Possíveis falhas em uso intenso | O retry com backoff ameniza, mas não elimina |

---

## Configurar a API Key (Desenvolvimento)

1. Acesse o [Google AI Studio](https://aistudio.google.com/)
2. Gere uma chave de API gratuita
3. Insira no `src/App.jsx`:
   ```js
   const apiKey = "SUA_CHAVE_AQUI";
   ```

### Usando Variável de Ambiente (Recomendado para Produção)

Crie um arquivo `.env` na raiz do projeto (já no `.gitignore`):
```env
VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI
```

Atualize o `App.jsx`:
```js
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
```
