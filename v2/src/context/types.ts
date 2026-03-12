// Tipos compartilhados da aplicação — separados para compatibilidade com Vite Fast Refresh

export type TaxMap = { icms: number; ipi: number; pis: number; cofins: number };

export type Role = 'Júnior' | 'Pleno' | 'Sênior';

export interface Professional {
    id: string;
    name: string;
    role: Role;
    hourlyRate: number;
}

export interface TaskEntry {
    id: string;
    professionalId: string;
    task: string;
    hours: number;
    date: string;
}

export interface Product {
    id: number;
    name: string;
    category: string;
    storeType: 'supermercado' | 'posto';
    price: number;
    taxes: TaxMap;
    history: number[];
}

export interface ShoppingItem {
    product: Product;
    quantity: number;
}

export interface GoogleUser {
    name: string;
    email: string;
    picture: string;
}
