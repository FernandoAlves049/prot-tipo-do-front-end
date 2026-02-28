import React, { useState, useMemo, useRef, useEffect } from 'react';
import Login from './Login';
import TaxesExplanationTab from './TaxesExplanationTab';
import { 
  BarChart3, 
  PlusCircle, 
  ShoppingCart, 
  Search, 
  Filter, 
  Info, 
  Trash2, 
  Plus, 
  Minus,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Loader2,
  Receipt,
  CheckCircle2,
  ChevronDown,
  PieChart,
  Upload,
  ShoppingBasket,
  Fuel,
  Store,
  BookOpen
} from 'lucide-react';

// --- CONFIGURAÇÃO DA API GEMINI ---
const apiKey = ""; // A chave será providenciada pelo ambiente de execução

const fetchGeminiWithRetry = async (prompt, retries = 5) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Falha na resposta da API');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar uma resposta.";
    } catch (error) {
      if (i === retries - 1) return "⚠️ Ocorreu um erro ao comunicar com a Inteligência Artificial. Por favor, tente novamente mais tarde.";
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
};

// --- BASE DE DADOS INICIAL (Amostra com tipos de loja diferentes) ---
const initialProducts = [
  {
    "id": 1,
    "name": "Arroz Vasconcelos",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 28.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      25.65,
      27.07,
      27.93,
      28.5
    ]
  },
  {
    "id": 2,
    "name": "Arroz Barão",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 31,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      27.9,
      29.45,
      30.38,
      31
    ]
  },
  {
    "id": 3,
    "name": "Arroz Brejeiro",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 23,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      20.7,
      21.85,
      22.54,
      23
    ]
  },
  {
    "id": 4,
    "name": "Feijão carioca Cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 5,
    "name": "Feijão carioca Barão",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 6,
    "name": "Feijão carioca Patureba",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 7,
    "name": "Feijão carioca Garotinho",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 8,
    "name": "Feijão preto cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 12,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      10.8,
      11.4,
      11.76,
      12
    ]
  },
  {
    "id": 9,
    "name": "Feijão preto Barão",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 11,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      9.9,
      10.45,
      10.78,
      11
    ]
  },
  {
    "id": 10,
    "name": "Feijão preto Dona de",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 11,
    "name": "Óleo soja comigo",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 12,
    "name": "Óleo soja brasileiro",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 13,
    "name": "Óleo soja concórdia",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 14,
    "name": "Farinha de trigo cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 15,
    "name": "Farinha de trigo sotrigo",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 16,
    "name": "Farinha de trigo cristal emegê",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 17,
    "name": "Farinha de trigo Araguaia",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 18,
    "name": "Macarrão parafuso 500g Califórn",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 19,
    "name": "Macarrão parafuso emegê",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 20,
    "name": "Macarrão espaguete 1kg cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 21,
    "name": "Macarrão espaguete Califórnia",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 22,
    "name": "Sazón",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 23,
    "name": "Orégano",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 24,
    "name": "Chimichurri",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 25,
    "name": "Açafrão",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 26,
    "name": "Canela",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 27,
    "name": "Extrato goiali",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.25,
      2.38,
      2.45,
      2.5
    ]
  },
  {
    "id": 28,
    "name": "Extrato Fugini",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 29,
    "name": "Extrato Dez",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.25,
      2.38,
      2.45,
      2.5
    ]
  },
  {
    "id": 30,
    "name": "Bolacha rosquinha Mabel",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.65,
      8.07,
      8.33,
      8.5
    ]
  },
  {
    "id": 31,
    "name": "Bolacha rosquinha adoralle",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 32,
    "name": "Bolacha rosquinha rancheiro",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 33,
    "name": "Bolacha rosquinha belma",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 34,
    "name": "Bolacha cream crack Mabel",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 35,
    "name": "Bolacha cream crack adoralle",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 36,
    "name": "Bolacha cream crack belma",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 37,
    "name": "Toddy 200g",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 38,
    "name": "Nescau 200g",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 39,
    "name": "Leite condenado italac",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 40,
    "name": "Leite condenado",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 41,
    "name": "Leite condenado mococa",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.95,
      5.22,
      5.39,
      5.5
    ]
  },
  {
    "id": 42,
    "name": "Creme de leite italac",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.15,
      3.32,
      3.43,
      3.5
    ]
  },
  {
    "id": 43,
    "name": "Creme de leite Nestle",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 44,
    "name": "Creme de leite Piracanjuba",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 45,
    "name": "Café gigante 250g",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 19,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.1,
      18.05,
      18.62,
      19
    ]
  },
  {
    "id": 46,
    "name": "Café pirâmide",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 20.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      18.45,
      19.47,
      20.09,
      20.5
    ]
  },
  {
    "id": 47,
    "name": "Café coringa",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 19.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.55,
      18.52,
      19.11,
      19.5
    ]
  },
  {
    "id": 48,
    "name": "Pão de forma Pullman",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 10,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9,
      9.5,
      9.8,
      10
    ]
  },
  {
    "id": 49,
    "name": "Pão de forma sevenboys",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 50,
    "name": "Pão de forma DiNapoli",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 51,
    "name": "Tomate",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 10,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      9,
      9.5,
      9.8,
      10
    ]
  },
  {
    "id": 52,
    "name": "Cenoura",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 4.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      4.05,
      4.27,
      4.41,
      4.5
    ]
  },
  {
    "id": 53,
    "name": "Batata",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 54,
    "name": "Cebola",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 4.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      4.05,
      4.27,
      4.41,
      4.5
    ]
  },
  {
    "id": 55,
    "name": "Alho",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 3.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      3.15,
      3.32,
      3.43,
      3.5
    ]
  },
  {
    "id": 56,
    "name": "Alface",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 2.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      2.25,
      2.38,
      2.45,
      2.5
    ]
  },
  {
    "id": 57,
    "name": "Batata doce",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 58,
    "name": "Repolho",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 59,
    "name": "Laranja",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 9.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      8.55,
      9.03,
      9.31,
      9.5
    ]
  },
  {
    "id": 60,
    "name": "Banana nanica",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 61,
    "name": "Banana prata",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 62,
    "name": "Banana maçã",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 63,
    "name": "Banana terra",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 64,
    "name": "Maçã",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 12,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      10.8,
      11.4,
      11.76,
      12
    ]
  },
  {
    "id": 65,
    "name": "Limão",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 3.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      3.15,
      3.32,
      3.43,
      3.5
    ]
  },
  {
    "id": 66,
    "name": "Ovo branco",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 18.5,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      16.65,
      17.57,
      18.13,
      18.5
    ]
  },
  {
    "id": 67,
    "name": "Ovo caipira",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 25,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      22.5,
      23.75,
      24.5,
      25
    ]
  },
  {
    "id": 68,
    "name": "Pepsi",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 69,
    "name": "Pepsi balch",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 70,
    "name": "Guaraná antártica",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 71,
    "name": "Guaraná antártica zero",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 72,
    "name": "Coca cola",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 8.5,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.65,
      8.07,
      8.33,
      8.5
    ]
  },
  {
    "id": 73,
    "name": "Coca zero",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 74,
    "name": "Suco lafruit",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 5.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.95,
      5.22,
      5.39,
      5.5
    ]
  },
  {
    "id": 75,
    "name": "Suco lafruit light",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 5.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.95,
      5.22,
      5.39,
      5.5
    ]
  },
  {
    "id": 76,
    "name": "Suco adoralle",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 6.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.85,
      6.17,
      6.37,
      6.5
    ]
  },
  {
    "id": 77,
    "name": "Suco del Valle",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 8.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.65,
      8.07,
      8.33,
      8.5
    ]
  },
  {
    "id": 78,
    "name": "Colgate",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 79,
    "name": "Closeup",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 80,
    "name": "Absorvente intimus noturno",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 9.5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.55,
      9.03,
      9.31,
      9.5
    ]
  },
  {
    "id": 81,
    "name": "Absorvente always noturno",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 10,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9,
      9.5,
      9.8,
      10
    ]
  },
  {
    "id": 82,
    "name": "Absorvente milli noturno",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 83,
    "name": "Creme seda",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 13,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      11.7,
      12.35,
      12.74,
      13
    ]
  },
  {
    "id": 84,
    "name": "Shampoo dove",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 17.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      15.75,
      16.63,
      17.15,
      17.5
    ]
  },
  {
    "id": 85,
    "name": "Condicionador dove",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 20.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      18.45,
      19.47,
      20.09,
      20.5
    ]
  },
  {
    "id": 86,
    "name": "Shampoo Elseve 200ml",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 19,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.1,
      18.05,
      18.62,
      19
    ]
  },
  {
    "id": 87,
    "name": "Condicionador Elseve",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 25.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      22.95,
      24.22,
      24.99,
      25.5
    ]
  },
  {
    "id": 88,
    "name": "Sabonete palmolive",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 89,
    "name": "Sabonete Lux",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 90,
    "name": "Sabonete laflore",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 4.5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.05,
      4.27,
      4.41,
      4.5
    ]
  },
  {
    "id": 91,
    "name": "Desodorante masculino Rexona",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 22,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      19.8,
      20.9,
      21.56,
      22
    ]
  },
  {
    "id": 92,
    "name": "Desodorante masculino Bozzano",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 93,
    "name": "Desodorante masculino Above",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 94,
    "name": "Desodorante feminino Rexona",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 22,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      19.8,
      20.9,
      21.56,
      22
    ]
  },
  {
    "id": 95,
    "name": "Desodorante feminino Nivea",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 17,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      15.3,
      16.15,
      16.66,
      17
    ]
  },
  {
    "id": 96,
    "name": "Desodorante feminino Giovanna",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 15,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      13.5,
      14.25,
      14.7,
      15
    ]
  },
  {
    "id": 97,
    "name": "Papel higiênico Mili",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 18,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      16.2,
      17.1,
      17.64,
      18
    ]
  },
  {
    "id": 98,
    "name": "Papel higiênico atualle",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 13,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      11.7,
      12.35,
      12.74,
      13
    ]
  },
  {
    "id": 99,
    "name": "Papel higiênico mímmo",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 18,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      16.2,
      17.1,
      17.64,
      18
    ]
  },
  {
    "id": 100,
    "name": "Papel toalha snob 50",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 101,
    "name": "Papel toalha Mili",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 102,
    "name": "Limpador veja",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 14.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      13.05,
      13.77,
      14.21,
      14.5
    ]
  },
  {
    "id": 103,
    "name": "Limpador CIF",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 104,
    "name": "Limpador Ypê",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 105,
    "name": "Desinfetante pinho",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 106,
    "name": "Desinfetante Ypê",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 107,
    "name": "Desinfetante pinho sol",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 108,
    "name": "Água sanitária qBoa 1 litro",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 109,
    "name": "Água sanitária ki joia",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 110,
    "name": "Água sanitária zupp",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 2.5,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.25,
      2.38,
      2.45,
      2.5
    ]
  },
  {
    "id": 111,
    "name": "Detergente Ypê",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 112,
    "name": "Detergente azulim",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 1,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      0.9,
      0.95,
      0.98,
      1
    ]
  },
  {
    "id": 113,
    "name": "Detergente ki joia",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 1,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      0.9,
      0.95,
      0.98,
      1
    ]
  },
  {
    "id": 114,
    "name": "Sabão de barra ype",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 10,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9,
      9.5,
      9.8,
      10
    ]
  },
  {
    "id": 115,
    "name": "Sabão em barra minuano",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 116,
    "name": "Sabão em pó omo 800g",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 117,
    "name": "Sabão em pó minuano",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 10,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9,
      9.5,
      9.8,
      10
    ]
  },
  {
    "id": 118,
    "name": "Sabão em pó tixan",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 7.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.75,
      7.13,
      7.35,
      7.5
    ]
  },
  {
    "id": 119,
    "name": "Sabão em pó brilhante",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 14.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      13.05,
      13.77,
      14.21,
      14.5
    ]
  },
  {
    "id": 120,
    "name": "Amaciante Ypê 2L",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 11,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9.9,
      10.45,
      10.78,
      11
    ]
  },
  {
    "id": 121,
    "name": "Amaciante sense",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 122,
    "name": "Amaciante mon bijou",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 9.5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.55,
      9.03,
      9.31,
      9.5
    ]
  },
  {
    "id": 123,
    "name": "Maionese quero sachê 200g",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 124,
    "name": "Maionese Hellmann's",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 125,
    "name": "Maionese fugini",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 126,
    "name": "Acem",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 28.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      25.65,
      27.07,
      27.93,
      28.5
    ]
  },
  {
    "id": 127,
    "name": "Alcatra",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 43,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      38.7,
      40.85,
      42.14,
      43
    ]
  },
  {
    "id": 128,
    "name": "Cupim",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 36,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      32.4,
      34.2,
      35.28,
      36
    ]
  },
  {
    "id": 129,
    "name": "Patinho",
    "category": "Outros",
    "storeType": "supermercado",
    "price": 37.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      33.75,
      35.63,
      36.75,
      37.5
    ]
  },
  {
    "id": 130,
    "name": "Costela",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 20.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      18.45,
      19.47,
      20.09,
      20.5
    ]
  },
  {
    "id": 131,
    "name": "Barriguinha",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 19,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.1,
      18.05,
      18.62,
      19
    ]
  },
  {
    "id": 132,
    "name": "Bisteca",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 26,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      23.4,
      24.7,
      25.48,
      26
    ]
  },
  {
    "id": 133,
    "name": "Lombo",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 25,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      22.5,
      23.75,
      24.5,
      25
    ]
  },
  {
    "id": 134,
    "name": "Costelinha",
    "category": "Outros",
    "storeType": "supermercado",
    "price": 25,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      22.5,
      23.75,
      24.5,
      25
    ]
  },
  {
    "id": 135,
    "name": "Pernil",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 18,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      16.2,
      17.1,
      17.64,
      18
    ]
  },
  {
    "id": 136,
    "name": "Asinha",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 16,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      14.4,
      15.2,
      15.68,
      16
    ]
  },
  {
    "id": 137,
    "name": "Coxinha",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 16,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      14.4,
      15.2,
      15.68,
      16
    ]
  },
  {
    "id": 138,
    "name": "Coxa sobrecoxa",
    "category": "Outros",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 139,
    "name": "Filé de peito",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 24,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      21.6,
      22.8,
      23.52,
      24
    ]
  },
  {
    "id": 140,
    "name": "Frango",
    "category": "Carnes",
    "storeType": "supermercado",
    "price": 10.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9.45,
      9.97,
      10.29,
      10.5
    ]
  },
  {
    "id": 141,
    "name": "Açucar cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 19.75,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.78,
      18.76,
      19.36,
      19.75
    ]
  },
  {
    "id": 142,
    "name": "Açucar Vasconcelos",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 21,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      18.9,
      19.95,
      20.58,
      21
    ]
  },
  {
    "id": 143,
    "name": "Açucar ecoaçucar",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 20,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      18,
      19,
      19.6,
      20
    ]
  },
  {
    "id": 144,
    "name": "Cerveja amstel",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 2.75,
    "taxes": {
      "icms": 0.21,
      "ipi": 0.15,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.48,
      2.61,
      2.69,
      2.75
    ]
  },
  {
    "id": 145,
    "name": "Cerveja Heineken",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 4.75,
    "taxes": {
      "icms": 0.21,
      "ipi": 0.15,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.28,
      4.51,
      4.66,
      4.75
    ]
  },
  {
    "id": 146,
    "name": "Cerveja Skol",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 2.25,
    "taxes": {
      "icms": 0.21,
      "ipi": 0.15,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.02,
      2.14,
      2.21,
      2.25
    ]
  },
  {
    "id": 147,
    "name": "Cerveja Brahma",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.21,
      "ipi": 0.15,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 148,
    "name": "Cerveja antartica",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.21,
      "ipi": 0.15,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 149,
    "name": "Leite Piracanjuba",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5.5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.95,
      5.22,
      5.39,
      5.5
    ]
  },
  {
    "id": 150,
    "name": "Leite Italac",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 151,
    "name": "Leite LeitBom",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 152,
    "name": "Arroz Crystal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 34,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      30.6,
      32.3,
      33.32,
      34
    ]
  },
  {
    "id": 153,
    "name": "Arroz Painho",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 25,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      22.5,
      23.75,
      24.5,
      25
    ]
  },
  {
    "id": 154,
    "name": "Arroz Tio Jorge",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 26,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      23.4,
      24.7,
      25.48,
      26
    ]
  },
  {
    "id": 155,
    "name": "Feijão carioca cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 156,
    "name": "Feijão carioca filetto",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 157,
    "name": "Feijão Califórnia",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 158,
    "name": "Feijão rajada cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 11,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      9.9,
      10.45,
      10.78,
      11
    ]
  },
  {
    "id": 159,
    "name": "Óleo comigo",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 160,
    "name": "Óleo vitaliv",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 161,
    "name": "Óleo brasileiro",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 162,
    "name": "Óleo vila velha",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 163,
    "name": "Sal cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 164,
    "name": "Sal moc",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 165,
    "name": "Sal cisne",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 166,
    "name": "Sal uniouro",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 167,
    "name": "Feijão preto grão dourado",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 168,
    "name": "Feijão preto catalão",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 169,
    "name": "Feijão preto Vasconcelos",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 170,
    "name": "Feijão preto filetto",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 171,
    "name": "Farinha de trigo cristal - emegê",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.00165,
      "cofins": 0.0076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 172,
    "name": "Macarrão espaguete cristal",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 173,
    "name": "Macarrão parafuso Califórnia",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 174,
    "name": "Macarrão parafuso safra",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 175,
    "name": "Extrato olé",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 2,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      1.8,
      1.9,
      1.96,
      2
    ]
  },
  {
    "id": 176,
    "name": "Bolacha rosquinha emegê",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 177,
    "name": "Bolacha cream crack Vitarella",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 178,
    "name": "Leite condenado Piracanjuba",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 179,
    "name": "Café gigante",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 19,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.1,
      18.05,
      18.62,
      19
    ]
  },
  {
    "id": 180,
    "name": "Leite bonolat",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 181,
    "name": "Leite compleite",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 182,
    "name": "Pão de forma vilão pao",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 8,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      7.2,
      7.6,
      7.84,
      8
    ]
  },
  {
    "id": 183,
    "name": "Maçã fala",
    "category": "Hortifruti",
    "storeType": "supermercado",
    "price": 13,
    "taxes": {
      "icms": 0,
      "ipi": 0,
      "pis": 0,
      "cofins": 0
    },
    "history": [
      11.7,
      12.35,
      12.74,
      13
    ]
  },
  {
    "id": 184,
    "name": "Pepsi Black",
    "category": "Bebidas",
    "storeType": "supermercado",
    "price": 6,
    "taxes": {
      "icms": 0.21,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 185,
    "name": "Shampoo seda",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 12,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      10.8,
      11.4,
      11.76,
      12
    ]
  },
  {
    "id": 186,
    "name": "Condicionador",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 187,
    "name": "Shampoo Elseve",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 29,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.07,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      26.1,
      27.55,
      28.42,
      29
    ]
  },
  {
    "id": 188,
    "name": "Sabonete Palmolive",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 189,
    "name": "Rexona",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 16,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      14.4,
      15.2,
      15.68,
      16
    ]
  },
  {
    "id": 190,
    "name": "Above",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 11,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9.9,
      10.45,
      10.78,
      11
    ]
  },
  {
    "id": 191,
    "name": "Nivea",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 192,
    "name": "Giovanna baby",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 16,
    "taxes": {
      "icms": 0.25,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      14.4,
      15.2,
      15.68,
      16
    ]
  },
  {
    "id": 193,
    "name": "Papel toalha snob",
    "category": "Higiene",
    "storeType": "supermercado",
    "price": 5,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      4.5,
      4.75,
      4.9,
      5
    ]
  },
  {
    "id": 194,
    "name": "Desifetante pinho",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 4,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 195,
    "name": "Desifetante pinho sol",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 9,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      8.1,
      8.55,
      8.82,
      9
    ]
  },
  {
    "id": 196,
    "name": "Desifetante Ypê",
    "category": "Outros",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 197,
    "name": "Água sanitária qboa",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.12,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 198,
    "name": "Detergente zupp",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 1,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      0.9,
      0.95,
      0.98,
      1
    ]
  },
  {
    "id": 199,
    "name": "Sabão de barro ype",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 14,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      12.6,
      13.3,
      13.72,
      14
    ]
  },
  {
    "id": 200,
    "name": "Sabão de barro família",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 12,
    "taxes": {
      "icms": 0.12,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      10.8,
      11.4,
      11.76,
      12
    ]
  },
  {
    "id": 201,
    "name": "Sabão em pó omo",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 17,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      15.3,
      16.15,
      16.66,
      17
    ]
  },
  {
    "id": 202,
    "name": "Amaciante Ypê",
    "category": "Limpeza",
    "storeType": "supermercado",
    "price": 11,
    "taxes": {
      "icms": 0.19,
      "ipi": 0.05,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      9.9,
      10.45,
      10.78,
      11
    ]
  },
  {
    "id": 203,
    "name": "Maionese Hellmanns",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 7,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      6.3,
      6.65,
      6.86,
      7
    ]
  },
  {
    "id": 204,
    "name": "Maionese quero",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 3,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      2.7,
      2.85,
      2.94,
      3
    ]
  },
  {
    "id": 205,
    "name": "Açúcar Vasconcelos",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 28,
    "taxes": {
      "icms": 0.07,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      25.2,
      26.6,
      27.44,
      28
    ]
  },
  {
    "id": 206,
    "name": "Gasolina",
    "category": "Combustíveis",
    "storeType": "posto",
    "price": 6,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 207,
    "name": "Etanol",
    "category": "Combustíveis",
    "storeType": "posto",
    "price": 4,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      3.6,
      3.8,
      3.92,
      4
    ]
  },
  {
    "id": 208,
    "name": "Diesel",
    "category": "Combustíveis",
    "storeType": "posto",
    "price": 6,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      5.4,
      5.7,
      5.88,
      6
    ]
  },
  {
    "id": 209,
    "name": "Bujão de gás",
    "category": "Combustíveis",
    "storeType": "posto",
    "price": 98,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      88.2,
      93.1,
      96.04,
      98
    ]
  },
  {
    "id": 210,
    "name": "Pão francês",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 15,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      13.5,
      14.25,
      14.7,
      15
    ]
  },
  {
    "id": 211,
    "name": "Pão amanteigado",
    "category": "Alimentos",
    "storeType": "supermercado",
    "price": 19,
    "taxes": {
      "icms": 0.19,
      "ipi": 0,
      "pis": 0.0165,
      "cofins": 0.076
    },
    "history": [
      17.1,
      18.05,
      18.62,
      19
    ]
  }
];

const SUPERMERCADO_CATEGORIES = ['Todos', 'Alimentos', 'Hortifruti', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza', 'Outros'];
const POSTO_CATEGORIES = ['Todos', 'Combustíveis', 'Outros'];
const CATEGORIES = ['Todos', 'Alimentos', 'Hortifruti', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza', 'Combustíveis', 'Outros'];

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(initialProducts);
  const [shoppingList, setShoppingList] = useState([]);
  const fileInputRef = useRef(null);

  // --- FUNÇÃO PARA IMPORTAR CSV COM CLASSIFICAÇÃO AUTOMÁTICA DE LOJA ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const newProducts = [];
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 10) continue; 
        
        const name = cols[1]?.trim() || 'Produto Desconhecido';
        const price = parseFloat(cols[2]) || 0;
        
        const parseTax = (val) => {
           if(!val) return 0;
           const clean = val.replace('%', '').trim();
           return (parseFloat(clean) / 100) || 0;
        };

        const icms = parseTax(cols[3]);
        const pis = parseTax(cols[5]);  
        const cofins = parseTax(cols[7]); 
        const ipi = parseTax(cols[9]);  

        // Categorização
        let category = 'Outros';
        const n = name.toLowerCase();
        if (n.includes('arroz') || n.includes('feijão') || n.includes('açúcar') || n.includes('açucar') || n.includes('farinha') || n.includes('macarrão') || n.includes('café') || n.includes('pão') || n.includes('leite') || n.includes('óleo') || n.includes('sal') || n.includes('maionese') || n.includes('biscoito') || n.includes('bolacha') || n.includes('toddy') || n.includes('nescau')) category = 'Alimentos';
        else if (n.includes('cerveja') || n.includes('coca') || n.includes('refrigerante') || n.includes('suco') || n.includes('pepsi') || n.includes('guaraná')) category = 'Bebidas';
        else if (n.includes('coxinha') || n.includes('frango') || n.includes('peito') || n.includes('alcatra') || n.includes('carne') || n.includes('acem') || n.includes('cupim') || n.includes('costela') || n.includes('bisteca') || n.includes('lombo') || n.includes('pernil')) category = 'Carnes';
        else if (n.includes('tomate') || n.includes('banana') || n.includes('ovo') || n.includes('cenoura') || n.includes('cebola') || n.includes('alho') || n.includes('alface') || n.includes('batata') || n.includes('limão') || n.includes('maçã') || n.includes('laranja') || n.includes('repolho')) category = 'Hortifruti';
        else if (n.includes('shampoo') || n.includes('sabonete') || n.includes('papel') || n.includes('colgate') || n.includes('condicionador') || n.includes('creme') || n.includes('absorvente') || n.includes('fio dental') || n.includes('desodorante') || n.includes('prestobarba') || n.includes('closeup')) category = 'Higiene';
        else if (n.includes('sabão') || n.includes('detergente') || n.includes('água sanitária') || n.includes('amaciante') || n.includes('limpador') || n.includes('desinfetante') || n.includes('buxa')) category = 'Limpeza';
        else if (n.includes('gasolina') || n.includes('etanol') || n.includes('diesel') || n.includes('combustível')) category = 'Combustíveis';

        // TIPO DE LOJA (Mágico aqui!)
        const storeType = category === 'Combustíveis' ? 'posto' : 'supermercado';

        newProducts.push({
          id: Date.now() + i,
          name: name,
          category: category,
          storeType: storeType, // Adiciona a propriedade de filtro primário
          price: price,
          taxes: { icms, ipi, pis, cofins },
          history: [price * 0.90, price * 0.95, price * 0.98, price]
        });
      }
      
      setProducts(newProducts);
      alert(`${newProducts.length} produtos carregados com sucesso e classificados em Supermercado/Postos!`);
      event.target.value = null; 
    };
    reader.readAsText(file);
  };


  // Temas dinâmicos por aba
  const appThemes = {
    dashboard: {
      appBg: 'bg-slate-50',
      selection: 'selection:bg-emerald-100 selection:text-emerald-900',
      headerBg: 'bg-slate-900',
      headerIconBg: 'bg-emerald-500 shadow-emerald-500/30',
      navActiveText: 'text-emerald-600',
      navHoverText: 'hover:text-emerald-500',
      navActiveBg: 'bg-emerald-50/50',
      navIndicator: 'bg-emerald-600'
    },
    add: {
      appBg: 'bg-violet-50',
      selection: 'selection:bg-violet-100 selection:text-violet-900',
      headerBg: 'bg-violet-950',
      headerIconBg: 'bg-violet-500 shadow-violet-500/30',
      navActiveText: 'text-violet-600',
      navHoverText: 'hover:text-violet-500',
      navActiveBg: 'bg-violet-50/50',
      navIndicator: 'bg-violet-600'
    },
    list: {
      appBg: 'bg-sky-50',
      selection: 'selection:bg-sky-100 selection:text-sky-900',
      headerBg: 'bg-sky-950',
      headerIconBg: 'bg-sky-500 shadow-sky-500/30',
      navActiveText: 'text-sky-600',
      navHoverText: 'hover:text-sky-500',
      navActiveBg: 'bg-sky-50/50',
      navIndicator: 'bg-sky-600'
    },
    taxes: {
      appBg: 'bg-amber-50',
      selection: 'selection:bg-amber-100 selection:text-amber-900',
      headerBg: 'bg-amber-950',
      headerIconBg: 'bg-amber-500 shadow-amber-500/30',
      navActiveText: 'text-amber-600',
      navHoverText: 'hover:text-amber-500',
      navActiveBg: 'bg-amber-50/50',
      navIndicator: 'bg-amber-600'
    }
  };
  const theme = appThemes[activeTab] || appThemes.dashboard;

  const Header = () => (
    <header className={`text-white pt-6 pb-20 px-6 transition-colors duration-500 ${theme.headerBg}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-lg transition-colors duration-500 ${theme.headerIconBg}`}>
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Meu Índice de Preços</h1>
            <p className="text-slate-400 text-sm font-medium">Projeto de Extensão - Morrinhos/GO</p>
          </div>
        </div>
        
        <div>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Upload size={18} />
            Importar Produtos (CSV)
          </button>
        </div>
      </div>
    </header>
  );

  const Navigation = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
      <nav className="bg-white rounded-2xl shadow-md border border-slate-200 flex overflow-hidden">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'Painel e Análises' },
          { id: 'add', icon: PlusCircle, label: 'Novo Produto' },
          { id: 'list', icon: ShoppingCart, label: 'Lista de Compras' },
          { id: 'taxes', icon: BookOpen, label: 'Info Impostos' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 transition-all duration-300 relative ${
              activeTab === tab.id ? `${theme.navActiveText} ${theme.navActiveBg}` : `text-slate-500 ${theme.navHoverText} hover:bg-slate-50`
            }`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? theme.navActiveText : 'text-slate-400'} />
            <span className="font-semibold text-sm hidden sm:block">{tab.label}</span>
            {activeTab === tab.id && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full transition-colors duration-500 ${theme.navIndicator}`} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  // --- MÓDULO 1: GRÁFICOS E ANÁLISES (ALTAMENTE ESTILIZADO) ---
  const DashboardTab = () => {
    const [activeStore, setActiveStore] = useState('supermercado'); // 'supermercado' | 'posto'
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [dashSearch, setDashSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    // Dicionário de Temas para Estilização Dinâmica
    const theme = activeStore === 'supermercado' ? {
      bgApp: 'bg-slate-50',
      cardBg: 'bg-white border-slate-200',
      cardHeader: 'bg-slate-50 border-slate-100',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      accentColor: 'text-emerald-600',
      accentBg: 'bg-emerald-500 text-white',
      accentBgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accentBorder: 'border-emerald-500',
      iconColor: 'text-emerald-500',
      chartBar: 'from-emerald-500 to-emerald-300 hover:from-emerald-400 hover:to-emerald-200',
      gradientFilter: 'from-emerald-900 to-slate-800',
      filterButtonActive: 'bg-emerald-500 text-white shadow-emerald-500/30',
      filterButtonIdle: 'bg-slate-800/50 text-slate-300 hover:bg-slate-700',
      chartGrid: 'border-slate-300',
      chartTooltip: 'bg-slate-800 text-white',
      chartBarPred: 'bg-emerald-50 border-2 border-dashed border-emerald-400',
      aiBox: 'bg-emerald-900 text-emerald-50 shadow-emerald-900/20'
    } : {
      bgApp: 'bg-slate-950', // Dark mode para posto
      cardBg: 'bg-slate-900 border-slate-800',
      cardHeader: 'bg-slate-800/50 border-slate-800',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      accentColor: 'text-amber-400',
      accentBg: 'bg-amber-500 text-slate-900',
      accentBgLight: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      accentBorder: 'border-amber-500',
      iconColor: 'text-amber-400',
      chartBar: 'from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200',
      gradientFilter: 'from-slate-900 to-black border-slate-800',
      filterButtonActive: 'bg-amber-500 text-slate-900 shadow-amber-500/20 font-black',
      filterButtonIdle: 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700',
      chartGrid: 'border-slate-700',
      chartTooltip: 'bg-amber-500 text-slate-900 font-bold',
      chartBarPred: 'bg-slate-800 border-2 border-dashed border-amber-500/50',
      aiBox: 'bg-amber-500/10 border border-amber-500/30 text-amber-50 shadow-amber-900/20'
    };

    // Reset categorias ao trocar de loja
    useEffect(() => {
      setSelectedCategory('Todos');
      setDashSearch('');
    }, [activeStore]);

    const storeProducts = useMemo(() => products.filter(p => p.storeType === activeStore), [products, activeStore]);
    
    const filteredProducts = useMemo(() => {
      return storeProducts.filter(p => {
        const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(dashSearch.toLowerCase());
        return matchCat && matchSearch;
      });
    }, [storeProducts, selectedCategory, dashSearch]);

    useEffect(() => {
      if (filteredProducts.length > 0 && (!selectedProduct || !filteredProducts.find(p => p.id === selectedProduct.id))) {
        setSelectedProduct(filteredProducts[0]);
      } else if (filteredProducts.length === 0) {
        setSelectedProduct(null);
      }
    }, [filteredProducts, selectedProduct]);

    const activeProduct = selectedProduct;
    const currentCategories = activeStore === 'supermercado' ? SUPERMERCADO_CATEGORIES : POSTO_CATEGORIES;
    const getTaxTotal = (taxes) => taxes.icms + taxes.ipi + taxes.pis + taxes.cofins;

    const handleExplainTrend = async () => {
      if (!activeProduct) return;
      setIsExplaining(true); setAiExplanation('');
      const historyStr = activeProduct.history.map(p => `R$ ${p.toFixed(2)}`).join(' -> ');
      const contexto = activeStore === 'posto' ? 'do setor de combustíveis' : 'do setor varejista';
      const prompt = `Como analista financeiro ${contexto}, explique em 1 parágrafo curto a variação de preços de "${activeProduct.name}" nos últimos meses: ${historyStr} no Brasil.`;
      setAiExplanation(await fetchGeminiWithRetry(prompt));
      setIsExplaining(false);
    };

    const categoryStats = useMemo(() => {
      if (filteredProducts.length === 0) return { avgPrice: 0, avgTax: 0, count: 0 };
      const totalP = filteredProducts.reduce((acc, p) => acc + p.price, 0);
      const totalT = filteredProducts.reduce((acc, p) => acc + getTaxTotal(p.taxes), 0);
      return {
        avgPrice: totalP / filteredProducts.length,
        avgTax: (totalT / filteredProducts.length) * 100,
        count: filteredProducts.length
      };
    }, [filteredProducts]);

    // Algoritmo de Predição
    const getChartData = (history) => {
      if (!history || history.length === 0) return [];
      const data = history.map((p, i) => ({ price: p, type: 'history', label: `Mês ${i + 1}` }));
      
      let avgGrowth = 0;
      if (history.length > 1) {
        let totalGrowth = 0;
        for (let i = 1; i < history.length; i++) {
          totalGrowth += (history[i] - history[i-1]) / history[i-1];
        }
        avgGrowth = totalGrowth / (history.length - 1);
      } else {
        avgGrowth = 0.01; // Crescimento padrão de 1% caso só exista 1 preço
      }
      
      let lastPrice = history[history.length - 1];
      for (let i = 1; i <= 2; i++) { 
        lastPrice = lastPrice * (1 + avgGrowth);
        data.push({ price: lastPrice, type: 'prediction', label: `Prev ${i}` });
      }
      return data;
    };

    const chartData = activeProduct ? getChartData(activeProduct.history) : [];
    
    // Cálculos de escala para o Gráfico de Linhas (SVG)
    let historyPath = '';
    let predPath = '';
    let getX = () => 0;
    let getY = () => 0;

    if (chartData.length > 0) {
      const N = chartData.length;
      const prices = chartData.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const padding = (maxPrice - minPrice) * 0.2 || minPrice * 0.1; 
      const yMin = Math.max(0, minPrice - padding);
      const yMax = maxPrice + padding;
      const yRange = yMax - yMin;

      getX = (index) => (index / (N - 1)) * 100;
      getY = (price) => 100 - ((price - yMin) / yRange) * 100;

      const historyData = chartData.filter(d => d.type === 'history');
      historyPath = historyData.map((d, i) => `${getX(i)},${getY(d.price)}`).join(' ');

      const firstPredIdx = historyData.length;
      // A linha de predição conecta-se ao último ponto do histórico
      const predDataForPath = chartData.slice(firstPredIdx - 1); 
      predPath = predDataForPath.map((d, i) => `${getX(firstPredIdx - 1 + i)},${getY(d.price)}`).join(' ');
    }

    return (
      <div className={`p-6 -mx-4 sm:-mx-6 -mt-6 rounded-3xl animate-in fade-in duration-700 transition-colors ${theme.bgApp} min-h-[800px]`}>
        
        {/* Toggle Duplo de Lojas */}
        <div className="flex justify-center mb-8 pt-4">
          <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl flex gap-2 backdrop-blur-sm border border-slate-300/50 shadow-inner">
            <button 
              onClick={() => setActiveStore('supermercado')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeStore === 'supermercado' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100/50'
              }`}
            >
              <ShoppingBasket size={18} /> Varejo & Supermercado
            </button>
            <button 
              onClick={() => setActiveStore('posto')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeStore === 'posto' ? 'bg-slate-900 text-amber-400 shadow-lg ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Fuel size={18} /> Postos de Combustível
            </button>
          </div>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* TOP KPIs e Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={`p-4 md:col-span-2 bg-gradient-to-br ${theme.gradientFilter} border-none shadow-lg`}>
              <h2 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Store size={16} /> Setores do {activeStore === 'supermercado' ? 'Mercado' : 'Posto'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentCategories.map(cat => (
                  <button
                    key={cat} onClick={() => { setSelectedCategory(cat); setAiExplanation(''); }}
                    className={`px-4 py-2 rounded-lg text-xs transition-all ${selectedCategory === cat ? theme.filterButtonActive : theme.filterButtonIdle}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Card>
            
            <Card className={`p-5 flex flex-col justify-center border-l-4 ${theme.cardBg} ${theme.borderAccent}`}>
              <span className={`text-sm font-bold mb-1 ${theme.textSecondary}`}>Preço Médio Unitário</span>
              <span className={`text-3xl font-black tracking-tight ${theme.textPrimary} ${activeStore === 'posto' ? 'font-mono' : ''}`}>
                R$ {categoryStats.avgPrice.toFixed(2)}
              </span>
              <span className={`text-xs mt-1 ${theme.textSecondary}`}>Média de {categoryStats.count} produtos</span>
            </Card>

            <Card className={`p-5 flex flex-col justify-center border-l-4 border-l-rose-500 ${theme.cardBg}`}>
              <span className={`text-sm font-bold mb-1 ${theme.textSecondary}`}>Carga Trib. Média</span>
              <span className={`text-3xl font-black tracking-tight text-rose-500 ${activeStore === 'posto' ? 'font-mono' : ''}`}>
                {categoryStats.avgTax.toFixed(1)}%
              </span>
              <span className={`text-xs mt-1 ${theme.textSecondary}`}>do subsetor selecionado</span>
            </Card>
          </div>

          {/* ÁREA PRINCIPAL DO DASHBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna Esquerda: Seletor de Produtos */}
            <Card className={`flex flex-col h-[600px] ${theme.cardBg}`}>
              <div className={`p-4 border-b ${theme.cardHeader}`}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${theme.textPrimary}`}>
                  <Search size={18} className={theme.iconColor} /> Catálogo
                </h3>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className={`w-full px-4 py-3 bg-transparent border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                    activeStore === 'posto' ? 'border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500' : 'border-slate-300 text-slate-800 focus:ring-emerald-500'
                  }`}
                  value={dashSearch}
                  onChange={(e) => setDashSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {filteredProducts.length > 0 ? (
                  <ul className="space-y-1">
                    {filteredProducts.map(p => (
                      <li key={p.id}>
                        <button
                          onClick={() => { setSelectedProduct(p); setAiExplanation(''); }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center border ${
                            activeProduct?.id === p.id 
                              ? `${theme.accentBgLight}` 
                              : `bg-transparent border-transparent hover:${activeStore==='posto'?'bg-slate-800':'bg-slate-50'} ${theme.textPrimary}`
                          }`}
                        >
                          <span className="font-semibold text-sm truncate pr-2">{p.name}</span>
                          <span className={`text-xs font-bold ${activeProduct?.id === p.id ? theme.accentColor : theme.textSecondary}`}>
                            R$ {p.price.toFixed(2)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={`text-center py-10 px-4 text-sm ${theme.textSecondary}`}>
                    Nenhum produto encontrado neste filtro.
                  </div>
                )}
              </div>
            </Card>

            {/* Coluna Direita: Detalhes do Produto */}
            {activeProduct ? (
              <div className="lg:col-span-2 space-y-6 flex flex-col">
                
                {/* Header do Produto */}
                <Card className={`p-6 ${theme.cardBg}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg mb-2 uppercase tracking-wider ${
                        activeStore === 'posto' ? 'bg-slate-800 text-amber-500' : 'bg-slate-100 text-emerald-700'
                      }`}>
                        {activeProduct.category}
                      </span>
                      <h2 className={`text-3xl font-black ${theme.textPrimary}`}>{activeProduct.name}</h2>
                      <p className={`font-medium mt-1 ${theme.textSecondary}`}>Análise detalhada de composição de valor.</p>
                    </div>
                    <div className="text-right">
                      <span className={`block text-sm font-bold ${theme.textSecondary}`}>Preço na Bomba / Prateleira</span>
                      <span className={`text-5xl font-black tracking-tighter ${theme.accentColor} ${activeStore === 'posto' ? 'font-mono' : ''}`}>
                        R$ {activeProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className={`mt-6 pt-6 border-t ${activeStore==='posto'?'border-slate-800':'border-slate-100'}`}>
                    <button 
                      onClick={handleExplainTrend} 
                      disabled={isExplaining} 
                      className={`w-full font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm border disabled:opacity-50 ${
                        activeStore === 'posto' ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {isExplaining ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      {isExplaining ? 'A extrair dados...' : 'Relatório de IA sobre este item'}
                    </button>
                    {aiExplanation && (
                      <div className={`mt-4 p-5 rounded-xl text-sm leading-relaxed ${theme.aiBox} animate-in slide-in-from-top-4`}>
                        <h4 className="flex items-center gap-2 font-bold mb-2 uppercase tracking-wider text-xs">
                          <Sparkles size={14} /> Avaliação Inteligente
                        </h4>
                        <p>{aiExplanation}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  <Card className={`p-6 flex flex-col ${theme.cardBg}`}>
                    <h3 className={`text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2 ${theme.textPrimary}`}>
                      <TrendingUp size={16} className={theme.iconColor}/> Evolução e Previsão
                    </h3>
                    
                    <div className="flex-1 relative flex flex-col pt-4 h-48">
                      {/* Gridlines de Fundo */}
                      <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between opacity-30 pointer-events-none z-0">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`border-b border-dashed w-full ${theme.chartGrid}`}></div>
                        ))}
                      </div>

                      {/* Área do Gráfico de Linhas (SVG) */}
                      <div className="relative flex-1 w-full mb-2 z-10">
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                          {/* Linha de Histórico */}
                          <polyline 
                            points={historyPath} 
                            fill="none" 
                            strokeWidth="3" 
                            className={theme.iconColor} 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                          {/* Linha de Previsão */}
                          <polyline 
                            points={predPath} 
                            fill="none" 
                            strokeWidth="3" 
                            className={theme.iconColor} 
                            stroke="currentColor" 
                            strokeDasharray="6 4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                        </svg>

                        {/* Pontos de Dados e Tooltips interativas */}
                        {chartData.map((d, i) => (
                          <div 
                            key={i} 
                            className="absolute group cursor-pointer" 
                            style={{ left: `${getX(i)}%`, top: `${getY(d.price)}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg ${theme.chartTooltip} z-20 pointer-events-none`}>
                              R$ {d.price.toFixed(2)}
                            </span>
                            <div className={`w-3.5 h-3.5 rounded-full border-2 shadow-sm transition-transform duration-300 group-hover:scale-150 ${d.type === 'history' ? `bg-white ${theme.accentBorder}` : `bg-slate-100 ${theme.accentBorder} border-dashed`}`} />
                          </div>
                        ))}
                      </div>

                      {/* Rótulos do Eixo X */}
                      <div className="h-6 relative w-full mt-2">
                        {chartData.map((d, i) => (
                          <span 
                            key={i} 
                            className={`absolute text-[10px] font-bold uppercase -translate-x-1/2 ${d.type === 'prediction' ? theme.accentColor : theme.textSecondary}`} 
                            style={{ left: `${getX(i)}%` }}
                          >
                            {d.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-6 flex flex-col ${theme.cardBg}`}>
                    <h3 className={`text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2 ${theme.textPrimary}`}>
                      <PieChart size={16} className="text-rose-500"/> Tributação
                    </h3>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="h-6 flex rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner mb-6">
                        <div style={{ width: `${100 - getTaxTotal(activeProduct.taxes) * 100}%` }} className={activeStore==='posto'?'bg-amber-500':'bg-emerald-500'} title="Produto" />
                        <div style={{ width: `${activeProduct.taxes.icms * 100}%` }} className="bg-indigo-500" title="ICMS" />
                        <div style={{ width: `${activeProduct.taxes.cofins * 100}%` }} className="bg-blue-500" title="COFINS" />
                        <div style={{ width: `${activeProduct.taxes.pis * 100}%` }} className="bg-cyan-500" title="PIS" />
                        <div style={{ width: `${activeProduct.taxes.ipi * 100}%` }} className="bg-teal-500" title="IPI" />
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div className={`flex items-center justify-between p-2 rounded ${activeStore==='posto'?'bg-slate-800':'bg-slate-50'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full shadow-sm ${activeStore==='posto'?'bg-amber-500':'bg-emerald-500'}`} />
                            <span className={`text-xs font-bold ${theme.textSecondary}`}>Líquido</span>
                          </div>
                          <span className={`text-xs font-black ${theme.textPrimary}`}>{(100 - getTaxTotal(activeProduct.taxes) * 100).toFixed(1)}%</span>
                        </div>
                        {[
                          { label: 'ICMS', val: activeProduct.taxes.icms, color: 'bg-indigo-500' },
                          { label: 'COFINS', val: activeProduct.taxes.cofins, color: 'bg-blue-500' },
                          { label: 'PIS', val: activeProduct.taxes.pis, color: 'bg-cyan-500' },
                          { label: 'IPI', val: activeProduct.taxes.ipi, color: 'bg-teal-500' }
                        ].map(tax => (
                          <div key={tax.label} className={`flex items-center justify-between p-2 rounded transition-colors hover:${activeStore==='posto'?'bg-slate-800':'bg-slate-50'}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${tax.color} shadow-sm`} />
                              <span className={`text-xs font-bold ${theme.textSecondary}`}>{tax.label}</span>
                            </div>
                            <span className={`text-xs font-black ${theme.textPrimary}`}>{(tax.val * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                      <div className={`mt-4 pt-4 border-t flex justify-between items-center ${activeStore==='posto'?'border-slate-800':'border-slate-100'}`}>
                        <span className="text-xs font-bold text-rose-500 uppercase">Total Impostos:</span>
                        <span className="text-lg font-black text-rose-600">R$ {(activeProduct.price * getTaxTotal(activeProduct.taxes)).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                </div>
              </div>
            ) : (
              <Card className={`lg:col-span-2 flex flex-col items-center justify-center py-24 text-center ${theme.cardBg}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${activeStore==='posto'?'bg-slate-800':'bg-slate-100'}`}>
                  <BarChart3 size={32} className={activeStore==='posto'?'text-slate-600':'text-slate-300'} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme.textPrimary}`}>Selecione um produto</h3>
                <p className={`max-w-sm ${theme.textSecondary}`}>Utilize o menu à esquerda para escolher um item deste setor.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- MÓDULO 2: INSERIR NOVO PRODUTO ---
  const AddProductTab = () => {
    // Mantém-se inalterado o módulo 2 do código base
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'Alimentos', price: '' });

    const searchResults = useMemo(() => {
      if (!searchTerm.trim()) return [];
      return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, products]);

    const handleAddProduct = (e) => {
      e.preventDefault();
      const taxes = { icms: 0.07, ipi: 0.00, pis: 0.0165, cofins: 0.076 };
      const productToAdd = {
        id: Date.now(), name: newProduct.name, category: newProduct.category,
        storeType: newProduct.category === 'Combustíveis' ? 'posto' : 'supermercado',
        price: parseFloat(newProduct.price), taxes, history: [parseFloat(newProduct.price)]
      };
      setProducts([...products, productToAdd]);
      setIsFormVisible(false); setSearchTerm('');
      alert('Produto cadastrado com sucesso!');
    };

    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Cadastrar Novo Produto</h2>
          <label className="block text-sm font-bold text-slate-700 mb-2">1. Pesquise no banco de dados primeiro</label>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text" placeholder="Ex: Macarrão, Gasolina..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="mt-4 animate-in fade-in">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500 mb-3">Já existem produtos parecidos:</p>
                  {searchResults.map(p => (
                    <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 truncate block">{p.name}</span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 inline-block">{p.category}</span>
                      </div>
                      <span className="text-sm font-black text-indigo-600">R$ {p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
                  <p className="text-amber-800 font-medium mb-4">Produto não encontrado. Quer adicioná-lo?</p>
                  <button 
                    onClick={() => { setNewProduct({...newProduct, name: searchTerm}); setIsFormVisible(true); }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    Prosseguir com o Cadastro
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>

        {isFormVisible && (
          <Card className="p-6 border-t-4 border-t-indigo-500 animate-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-slate-800 mb-6">2. Preencha as Informações</h3>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Produto</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                  <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700">
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preço (R$)</label>
                  <input required type="number" step="0.01" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsFormVisible(false)} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">
                  Salvar no Sistema
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>
    );
  };

  // --- MÓDULO 3: GERENCIAR LISTA DE COMPRAS ---
  const ShoppingListTab = () => {
    // Mantém-se inalterado o módulo 3 do código base
    const [listSearchTerm, setListSearchTerm] = useState('');
    const [catalogCategory, setCatalogCategory] = useState('Todos');
    const [selectedProductIds, setSelectedProductIds] = useState(new Set());
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const filteredCatalog = useMemo(() => {
      return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(listSearchTerm.toLowerCase()) || p.category.toLowerCase().includes(listSearchTerm.toLowerCase());
        const matchesCategory = catalogCategory === 'Todos' || p.category === catalogCategory;
        return matchesSearch && matchesCategory;
      });
    }, [products, listSearchTerm, catalogCategory]);

    const handleSelectAll = () => {
      const newSet = new Set(selectedProductIds);
      filteredCatalog.forEach(p => newSet.add(p.id));
      setSelectedProductIds(newSet);
    };

    const handleClearSelection = () => setSelectedProductIds(new Set());

    const handleAddMultiple = () => {
      if (selectedProductIds.size === 0) return;
      const updatedList = [...shoppingList];
      selectedProductIds.forEach(id => {
        const product = products.find(p => p.id === id);
        const existingIndex = updatedList.findIndex(item => item.product.id === id);
        if (existingIndex >= 0) updatedList[existingIndex].quantity += 1;
        else updatedList.push({ product, quantity: 1 });
      });
      setShoppingList(updatedList); setSelectedProductIds(new Set());
      setListSearchTerm(''); setCatalogCategory('Todos'); setIsCatalogOpen(false); setAiAnalysis('');
    };

    const toggleSelection = (id) => {
      const newSet = new Set(selectedProductIds);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      setSelectedProductIds(newSet);
    };

    const updateQuantity = (productId, delta) => {
      setShoppingList(shoppingList.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }));
      setAiAnalysis('');
    };

    const removeItem = (productId) => {
      setShoppingList(shoppingList.filter(item => item.product.id !== productId));
      setAiAnalysis('');
    };

    const totals = useMemo(() => {
      let totalPrice = 0, totalIcms = 0, totalIpi = 0, totalPis = 0, totalCofins = 0;
      shoppingList.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        totalPrice += itemTotal;
        totalIcms += itemTotal * item.product.taxes.icms;
        totalIpi += itemTotal * item.product.taxes.ipi;
        totalPis += itemTotal * item.product.taxes.pis;
        totalCofins += itemTotal * item.product.taxes.cofins;
      });
      return { 
        totalPrice, totalTax: totalIcms + totalIpi + totalPis + totalCofins, 
        breakdown: { icms: totalIcms, ipi: totalIpi, pis: totalPis, cofins: totalCofins } 
      };
    }, [shoppingList]);

    const handleAnalyzeList = async () => {
      if (shoppingList.length === 0) return;
      setIsAnalyzing(true); setAiAnalysis('');
      const listStr = shoppingList.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
      const prompt = `Como assistente inteligente de compras em supermercados no Brasil, veja esta lista: ${listStr}. Dê 2 sugestões curtas do que pode faltar para complementar e 1 dica focada em economizar nas compras. Formato direto e amigável.`;
      setAiAnalysis(await fetchGeminiWithRetry(prompt));
      setIsAnalyzing(false);
    };

    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <div className="relative z-20">
          <div className={`bg-white rounded-2xl shadow-md border ${isCatalogOpen ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'} transition-all`}>
            <div className="p-4 flex items-center gap-3">
              <Search className="text-slate-400" size={24} />
              <input
                type="text" placeholder={`Pesquise entre os ${products.length} produtos...`}
                className="w-full text-base font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent cursor-pointer"
                value={listSearchTerm} onChange={(e) => { setListSearchTerm(e.target.value); setIsCatalogOpen(true); }} onClick={() => setIsCatalogOpen(true)}
              />
              <div className="flex items-center gap-2">
                {selectedProductIds.size > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 font-bold text-xs px-2 py-1 rounded-full animate-in zoom-in">{selectedProductIds.size}</span>
                )}
                <ChevronDown className={`text-slate-400 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} size={20} />
              </div>
            </div>

            {isCatalogOpen && (
              <div className="border-t border-slate-100 bg-slate-50 rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={16} className="text-slate-400" />
                    <select className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer" value={catalogCategory} onChange={(e) => setCatalogCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c === 'Todos' ? 'Todas as Categorias' : c}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <button onClick={handleSelectAll} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">Selecionar Todos</button>
                    <button onClick={handleClearSelection} disabled={selectedProductIds.size === 0} className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors">Remover Tudo</button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto custom-scrollbar p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredCatalog.map(p => (
                    <div key={p.id} onClick={() => toggleSelection(p.id)} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedProductIds.has(p.id) ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 shadow-sm'}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedProductIds.has(p.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 bg-white'}`}>
                        {selectedProductIds.has(p.id) && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="text-xs font-medium text-slate-500">{p.category}</p>
                      </div>
                      <span className="text-sm font-black text-slate-700 whitespace-nowrap">R$ {p.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {filteredCatalog.length === 0 && <div className="col-span-full py-8 text-center text-slate-500">Nenhum produto encontrado. Tente outra pesquisa ou carregue o seu ficheiro CSV.</div>}
                </div>
                <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button onClick={() => setIsCatalogOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800">Ocultar catálogo</button>
                  <button onClick={handleAddMultiple} disabled={selectedProductIds.size === 0} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200"><Plus size={20} /> Adicionar à Lista</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {shoppingList.length > 0 ? (
          <div className="space-y-6">
            <Card className="flex flex-col">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShoppingCart size={18} className="text-indigo-500" /> Carrinho Atual ({shoppingList.length})</h3>
                <button onClick={() => { setShoppingList([]); setAiAnalysis(''); }} className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider">Esvaziar</button>
              </div>
              <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {shoppingList.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  const itemTax = itemTotal * (item.product.taxes.icms + item.product.taxes.ipi + item.product.taxes.pis + item.product.taxes.cofins);
                  return (
                    <li key={item.product.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-lg truncate block">{item.product.name}</h4>
                        <div className="text-sm font-medium mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="text-slate-500">Unidade: R$ {item.product.price.toFixed(2)}</span>
                          <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Imposto total: R$ {itemTax.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-colors"><Minus size={16} /></button>
                          <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-colors"><Plus size={16} /></button>
                        </div>
                        <div className="text-right min-w-[90px]"><div className="font-black text-slate-800 text-lg">R$ {itemTotal.toFixed(2)}</div></div>
                        <button onClick={() => removeItem(item.product.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-slate-50 hover:bg-rose-50 rounded-xl"><Trash2 size={20} /></button>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button onClick={handleAnalyzeList} disabled={isAnalyzing} className="w-full bg-white hover:bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 text-indigo-700 font-bold py-4 px-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm disabled:opacity-70">
                  {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="text-indigo-500" />}
                  {isAnalyzing ? 'A pensar...' : 'Dicas Inteligentes para sua Lista'}
                </button>
                {aiAnalysis && (
                  <div className="mt-4 p-6 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200/50 text-white animate-in slide-in-from-top-4">
                    <h4 className="text-sm font-bold text-indigo-200 mb-3 flex items-center gap-2 uppercase tracking-wider"><Sparkles size={16} /> Assistente de Economia</h4>
                    <p className="text-base font-medium leading-relaxed">{aiAnalysis}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-700">
              <div className="p-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b border-slate-800">
                <div className="text-center md:text-left">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center justify-center md:justify-start gap-2"><Receipt size={16} /> Previsão de Gastos</h3>
                  <p className="text-slate-300 text-sm max-w-sm">Estimativas com base nos preços médios praticados e taxas tributárias vigentes.</p>
                </div>
                <div className="text-center md:text-right">
                  <span className="block text-slate-400 font-bold text-sm mb-1">TOTAL A PAGAR</span>
                  <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">R$ {totals.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-slate-800 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-rose-400 font-bold flex items-center gap-2"><PieChart size={18} /> Destino dos Impostos</h4>
                  <span className="text-xl font-black text-rose-400">R$ {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'ICMS (Estadual)', val: totals.breakdown.icms, color: 'bg-indigo-500' },
                    { label: 'COFINS (Federal)', val: totals.breakdown.cofins, color: 'bg-blue-500' },
                    { label: 'PIS (Federal)', val: totals.breakdown.pis, color: 'bg-cyan-500' },
                    { label: 'IPI (Industrial)', val: totals.breakdown.ipi, color: 'bg-teal-500' }
                  ].map(tax => (
                    <div key={tax.label} className="bg-slate-900 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${tax.color}`} />
                        <span className="text-xs font-bold text-slate-400 uppercase">{tax.label}</span>
                      </div>
                      <span className="block text-lg font-bold text-white">R$ {tax.val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">O seu carrinho está vazio</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Use a barra de pesquisa acima para encontrar e adicionar produtos à sua lista.</p>
          </div>
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`min-h-screen font-sans text-slate-900 pb-24 transition-colors duration-500 ${theme.appBg} ${theme.selection}`}>
      <Header />
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {activeTab === 'dashboard' && <div className="animate-slide-in-left"><DashboardTab /></div>}
        {activeTab === 'add' && <div className="animate-slide-up"><AddProductTab /></div>}
        {activeTab === 'list' && <div className="animate-slide-in-right"><ShoppingListTab /></div>}
        {activeTab === 'taxes' && <div className="animate-fade-scale"><TaxesExplanationTab /></div>}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}