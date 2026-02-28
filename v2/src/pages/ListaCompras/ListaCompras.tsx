import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Search, ShoppingBasket } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';

export default function ListaCompras() {
    const { products, shoppingList, setShoppingList } = useAppContext();
    const [search, setSearch] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToList = (product: typeof products[0]) => {
        setShoppingList(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1 }];
        });
        setSearch('');
    };

    const updateQty = (id: number, delta: number) => {
        setShoppingList(prev =>
            prev.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        );
    };

    const removeItem = (id: number) => {
        setShoppingList(prev => prev.filter(i => i.product.id !== id));
    };

    const totalPrice = shoppingList.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const totalTax = shoppingList.reduce((s, i) => {
        const { icms, ipi, pis, cofins } = i.product.taxes;
        return s + (icms + ipi + pis + cofins) * i.product.price * i.quantity;
    }, 0);

    return (
        <>
            <PageMeta title="Lista de Compras | Meu Índice de Preços" description="Gerencie sua lista de compras e veja o total de impostos." />
            <div className="space-y-4">
                {/* Busca */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                    <h2 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <Search size={18} /> Buscar Produtos
                    </h2>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Digite o nome do produto..."
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                    {search && filteredProducts.length > 0 && (
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            {filteredProducts.slice(0, 6).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => addToList(p)}
                                    className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-left text-sm transition-colors"
                                >
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                                    <span className="text-sky-600 font-bold">R$ {p.price.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lista */}
                {shoppingList.length > 0 ? (
                    <>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-5 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2">
                                    <ShoppingCart size={18} /> Minha Lista ({shoppingList.length} {shoppingList.length === 1 ? 'item' : 'itens'})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {shoppingList.map(({ product, quantity }) => {
                                    const { icms, ipi, pis, cofins } = product.taxes;
                                    const taxPct = (icms + ipi + pis + cofins) * 100;
                                    return (
                                        <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{product.name}</p>
                                                <p className="text-xs text-gray-400">Imposto: {taxPct.toFixed(1)}% · R$ {product.price.toFixed(2)}/un</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => updateQty(product.id, -1)} className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-sky-900 text-gray-500 dark:text-gray-300 transition-colors">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-7 text-center font-bold text-gray-800 dark:text-gray-200 text-sm">{quantity}</span>
                                                <button onClick={() => updateQty(product.id, 1)} className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-sky-900 text-gray-500 dark:text-gray-300 transition-colors">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm w-20 text-right">R$ {(product.price * quantity).toFixed(2)}</span>
                                            <button onClick={() => removeItem(product.id)} className="p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Totalizador */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Resumo da Compra</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal (sem impostos)</span><span className="font-semibold text-gray-800 dark:text-gray-200">R$ {(totalPrice - totalTax).toFixed(2)}</span></div>
                                <div className="flex justify-between text-red-500"><span>Impostos incluídos</span><span className="font-semibold">R$ {totalTax.toFixed(2)}</span></div>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                                <div className="flex justify-between text-base font-bold"><span className="text-gray-800 dark:text-white">Total</span><span className="text-sky-600">R$ {totalPrice.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 py-20 text-center">
                        <div className="bg-sky-50 dark:bg-sky-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBasket size={40} className="text-sky-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Sua lista está vazia</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm">Use a busca acima para encontrar e adicionar produtos à sua lista de compras.</p>
                    </div>
                )}
            </div>
        </>
    );
}
