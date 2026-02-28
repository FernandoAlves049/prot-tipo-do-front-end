import React from 'react';
import { BookOpen, TrendingUp, Landmark, Package, Shield, Info } from 'lucide-react';

export default function TaxesExplanationTab() {
    const taxesVars = [
        {
            id: 'icms',
            name: 'ICMS',
            fullName: 'Imposto sobre Circulação de Mercadorias e Serviços',
            color: 'bg-indigo-500',
            lightColor: 'bg-indigo-50 text-indigo-700',
            icon: <TrendingUp size={24} />,
            desc: 'É um imposto estadual cobrado sempre que um produto circula, da fábrica até a sua mesa. Cada estado brasileiro tem a sua própria alíquota (porcentagem).'
        },
        {
            id: 'ipi',
            name: 'IPI',
            fullName: 'Imposto sobre Produtos Industrializados',
            color: 'bg-teal-500',
            lightColor: 'bg-teal-50 text-teal-700',
            icon: <Package size={24} />,
            desc: 'Imposto federal cobrado em produtos que passaram por alguma industrialização ou beneficiamento. Produtos como carros ou geladeiras pagam IPI; produtos naturais frescos (in natura) geralmente não.'
        },
        {
            id: 'pis',
            name: 'PIS',
            fullName: 'Programa de Integração Social',
            color: 'bg-cyan-500',
            lightColor: 'bg-cyan-50 text-cyan-700',
            icon: <Shield size={24} />,
            desc: 'É uma contribuição federal usada para custear o Seguro Desemprego e os Abonos para os trabalhadores brasileiros.'
        },
        {
            id: 'cofins',
            name: 'COFINS',
            fullName: 'Contribuição para o Financiamento da Seguridade Social',
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50 text-blue-700',
            icon: <Landmark size={24} />,
            desc: 'Outra contribuição federal extremamente importante, usada exclusivamente para manter a Saúde Pública (SUS), a Previdência Social e a Assistência Social.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto animate-slide-up duration-500 space-y-8 pb-10">

            <div className="bg-amber-500 rounded-3xl p-8 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden">
                <div className="relative z-10 md:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <BookOpen size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Educação Financeira</h2>
                    </div>
                    <p className="text-amber-50 font-medium text-lg leading-relaxed">
                        Você sabia que quando paga por um produto no caixa, parte desse dinheiro nem fica com o lojista? Fica com o Governo! Entenda os 4 fantásticos impostos que compõem o nosso sistema tributário.
                    </p>
                </div>

                {/* Decoração abstrata */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-30">
                    <svg width="250" height="250" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ffffff" d="M45.7,-76.4C58.9,-69.3,69.1,-55.3,77.3,-40.5C85.5,-25.7,91.7,-10.1,89.5,4.3C87.3,18.7,76.6,31.8,66.1,43.3C55.6,54.8,45.3,64.7,33.1,70.9C20.9,77.1,6.8,79.6,-7.3,81.1C-21.4,82.6,-35.6,83.1,-48.3,77.8C-61,72.5,-72.1,61.4,-78.9,48.1C-85.7,34.8,-88.2,19.3,-86.3,4.6C-84.4,-10.1,-78.1,-24,-70.7,-36.8C-63.3,-49.6,-54.8,-61.3,-42.9,-68.8C-31,-76.3,-15.5,-79.6,0.3,-80.1C16.1,-80.6,32.5,-83.5,45.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxesVars.map((tax, i) => (
                    <div
                        key={tax.id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow animate-slide-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-2xl ${tax.lightColor} flex-shrink-0`}>
                                {tax.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-slate-800">{tax.name}</h3>
                                    <div className={`w-2 h-2 rounded-full ${tax.color}`}></div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 leading-snug">{tax.fullName}</h4>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                    {tax.desc}
                                </p>
                            </div>
                        </div>
                    </div >
                ))
                }
            </div >

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="p-3 bg-slate-200 rounded-xl text-slate-500 shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 mb-1">Impacto Final no Consumidor</h4>
                    <p className="text-sm font-medium text-slate-600">
                        A junção de todos esses percentuais é o que chamamos de <strong>Carga Tributária</strong>. No Dashboard do sistema, o valor que você visualiza de impostos nada mais é do que o somatório dessa cadeia que incide de forma embutida no preço da prateleira.
                    </p>
                </div>
            </div>
        </div >
    );
}
