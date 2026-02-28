import React from 'react';

export default function Login({ onLogin }) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-blue-100 selection:text-blue-900 animate-fade-scale">
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md flex flex-col items-center">
                {/* Google Logo Mock */}
                <div className="flex gap-1 mb-4 select-none">
                    <span className="text-4xl font-bold text-[#4285F4]">G</span>
                    <span className="text-4xl font-bold text-[#EA4335]">o</span>
                    <span className="text-4xl font-bold text-[#FBBC05]">o</span>
                    <span className="text-4xl font-bold text-[#4285F4]">g</span>
                    <span className="text-4xl font-bold text-[#34A853]">l</span>
                    <span className="text-4xl font-bold text-[#EA4335]">e</span>
                </div>

                <h1 className="text-2xl font-medium text-slate-800 mb-2 tracking-tight">Fazer login</h1>
                <p className="text-base text-slate-600 mb-8 text-center">Ir para <span className="font-medium text-slate-800">Meu Índice de Preços</span></p>

                <div className="w-full space-y-4 mb-10">
                    <input
                        type="email"
                        placeholder="E-mail ou telefone"
                        className="w-full px-4 py-3 border border-slate-300 rounded-[4px] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-base"
                    />
                    <div className="flex justify-start">
                        <button className="text-[#1a73e8] hover:text-blue-800 text-sm font-medium tracking-wide">Esqueceu seu e-mail?</button>
                    </div>
                </div>

                <div className="text-sm text-slate-600 w-full mb-12">
                    Não está no seu computador? Use o modo visitante para fazer login com privacidade. <button className="text-[#1a73e8] font-medium hover:text-blue-800 tracking-wide">Saiba mais</button>
                </div>

                <div className="w-full flex justify-between items-center">
                    <button className="text-[#1a73e8] hover:text-blue-800 text-sm font-medium tracking-wide">Criar conta</button>
                    <button
                        onClick={onLogin}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-[4px] font-medium transition-colors shadow-sm focus:bg-blue-800"
                    >
                        Avançar
                    </button>
                </div>
            </div>
        </div>
    );
}
