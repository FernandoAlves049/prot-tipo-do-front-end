import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';

const CATEGORIES = ['Alimentos', 'Hortifruti', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza', 'Combustíveis', 'Outros'];

export default function NovoProduto() {
    const { setProducts } = useAppContext();

    const [form, setForm] = useState({
        name: '', category: 'Alimentos', storeType: 'supermercado' as 'supermercado' | 'posto',
        price: '', icms: '', ipi: '', pis: '', cofins: '',
    });
    const [saved, setSaved] = useState(false);

    const updateField = (k: string, v: string) => {
        setForm(prev => ({ ...prev, [k]: v }));
        if (k === 'category') {
            setForm(prev => ({ ...prev, category: v, storeType: v === 'Combustíveis' ? 'posto' : 'supermercado' }));
        }
        setSaved(false);
    };

    const taxTotal = (() => {
        const p = parseFloat(form.price) || 0;
        const t = (parseFloat(form.icms) || 0) / 100 + (parseFloat(form.ipi) || 0) / 100
            + (parseFloat(form.pis) || 0) / 100 + (parseFloat(form.cofins) || 0) / 100;
        return (p * t).toFixed(2);
    })();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(form.price) || 0;
        const newProduct = {
            id: Date.now(),
            name: form.name,
            category: form.category,
            storeType: form.storeType,
            price,
            taxes: {
                icms: (parseFloat(form.icms) || 0) / 100,
                ipi: (parseFloat(form.ipi) || 0) / 100,
                pis: (parseFloat(form.pis) || 0) / 100,
                cofins: (parseFloat(form.cofins) || 0) / 100,
            },
            history: [price * 0.90, price * 0.95, price * 0.98, price],
        };
        setProducts(prev => [...prev, newProduct]);
        setForm({ name: '', category: 'Alimentos', storeType: 'supermercado', price: '', icms: '', ipi: '', pis: '', cofins: '' });
        setSaved(true);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

    return (
        <>
            <PageMeta title="Novo Produto | Meu Índice de Preços" description="Cadastre novos produtos com suas alíquotas de tributos." />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-violet-50 dark:bg-violet-900/20">
                        <h2 className="text-lg font-bold text-violet-900 dark:text-violet-300">Cadastrar Novo Produto</h2>
                        <p className="text-sm text-violet-600 dark:text-violet-400 mt-0.5">Preencha os dados do produto e suas alíquotas tributárias</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {saved && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-700">
                                ✅ Produto cadastrado com sucesso!
                            </div>
                        )}

                        {/* Nome */}
                        <div>
                            <label className={labelClass}>Nome do Produto *</label>
                            <input required type="text" value={form.name} onChange={e => updateField('name', e.target.value)}
                                placeholder="Ex: Arroz Vasconcelos 5kg" className={inputClass} />
                        </div>

                        {/* Categoria + Tipo de Loja */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Categoria *</label>
                                <select value={form.category} onChange={e => updateField('category', e.target.value)} className={inputClass}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Tipo de Loja</label>
                                <div className="flex gap-2 pt-1">
                                    {(['supermercado', 'posto'] as const).map(t => (
                                        <button type="button" key={t} onClick={() => updateField('storeType', t)}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.storeType === t
                                                    ? 'bg-violet-600 text-white border-violet-600'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                                }`}>
                                            {t === 'supermercado' ? '🛒 Super' : '⛽ Posto'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Preço */}
                        <div>
                            <label className={labelClass}>Preço Atual (R$) *</label>
                            <input required type="number" step="0.01" min="0" value={form.price}
                                onChange={e => updateField('price', e.target.value)}
                                placeholder="0,00" className={inputClass} />
                        </div>

                        {/* Impostos */}
                        <div>
                            <p className={labelClass}>Alíquotas de Impostos (%)</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[['ICMS', 'icms'], ['IPI', 'ipi'], ['PIS', 'pis'], ['COFINS', 'cofins']].map(([label, key]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                                        <input type="number" step="0.001" min="0" max="100"
                                            value={form[key as keyof typeof form]} onChange={e => updateField(key, e.target.value)}
                                            placeholder="0" className={inputClass} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prévia */}
                        {form.price && (
                            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 text-sm">
                                <p className="font-semibold text-violet-700 dark:text-violet-300 mb-1">Prévia do Imposto</p>
                                <p className="text-violet-600 dark:text-violet-400">
                                    Do preço de <strong>R$ {parseFloat(form.price || '0').toFixed(2)}</strong>,
                                    cerca de <strong>R$ {taxTotal}</strong> são impostos.
                                </p>
                            </div>
                        )}

                        <button type="submit"
                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-md shadow-violet-500/20">
                            Salvar Produto
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
