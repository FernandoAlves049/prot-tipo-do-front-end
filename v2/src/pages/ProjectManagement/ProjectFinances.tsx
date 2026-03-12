import { useState, useMemo } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { DollarLineIcon, PlugInIcon, AlertIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { TrendingUp } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

interface Resource {
  id: string;
  name: string;
  type: string;
  cost: number;
}

const defaultResources: Resource[] = [
  { id: '1', name: 'Licença Figma', type: 'Design', cost: 495 },
  { id: '2', name: 'Hospedagem AWS', type: 'Infra', cost: 250 },
  { id: '3', name: 'Domínio .com.br', type: 'Infra', cost: 100 },
];

export default function ProjectFinances() {
  const { professionals, taskEntries } = useAppContext();
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [newRes, setNewRes] = useState({ name: '', type: '', cost: 0 });
  const [showResForm, setShowResForm] = useState(false);

  // Personnel cost = for each task entry, find professional hourly rate × hours
  const personnelBreakdown = useMemo(() => {
    return professionals.map(pro => {
      const entries = taskEntries.filter(t => t.professionalId === pro.id);
      const hours = entries.reduce((s, t) => s + t.hours, 0);
      const cost = hours * pro.hourlyRate;
      return { ...pro, hours, cost };
    }).filter(p => p.hours > 0);
  }, [professionals, taskEntries]);

  const totalPersonnel = personnelBreakdown.reduce((s, p) => s + p.cost, 0);
  const totalResources = resources.reduce((s, r) => s + r.cost, 0);
  const totalPrice = totalPersonnel + totalResources;

  const addResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.name.trim()) return;
    setResources(rs => [...rs, { ...newRes, id: Date.now().toString() }]);
    setNewRes({ name: '', type: '', cost: 0 });
    setShowResForm(false);
  };

  const removeResource = (id: string) => setResources(rs => rs.filter(r => r.id !== id));

  const ROLE_COLORS: Record<string, string> = {
    'Júnior': 'bg-green-100 text-green-700',
    'Pleno': 'bg-blue-100 text-blue-700',
    'Sênior': 'bg-purple-100 text-purple-700',
  };

  return (
    <>
      <PageMeta title="Financeiro | Gerenciamento de Projetos" description="Preço do projeto e recursos tecnológicos." />
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <DollarLineIcon className="w-6 h-6 text-brand-500" />
          Financeiro do Projeto
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Custo de Pessoal</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">R$ {totalPersonnel.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{personnelBreakdown.reduce((s, p) => s + p.hours, 0)}h trabalhadas</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-4">
              <PlugInIcon className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Recursos Tecnológicos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">R$ {totalResources.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">{resources.length} recurso{resources.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-brand-500 p-6 rounded-2xl text-white shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <DollarLineIcon className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/80 text-sm mb-1">Preço Total do Projeto</p>
            <p className="text-3xl font-bold">R$ {totalPrice.toFixed(2)}</p>
            <p className="text-white/60 text-xs mt-1">Pessoal + Recursos</p>
          </div>
        </div>

        {/* Personnel breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Custo por Profissional</h3>
          </div>
          {personnelBreakdown.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">Nenhuma hora registrada ainda.</p>
              <p className="text-gray-400 text-xs mt-1">Registre horas na página "Tarefas".</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Profissional</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nível</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Horas</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">R$/h</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {personnelBreakdown.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ROLE_COLORS[p.role]}`}>{p.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{p.hours}h</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">R$ {p.hourlyRate}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800 dark:text-white">R$ {p.cost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td colSpan={4} className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Total Pessoal</td>
                  <td className="px-6 py-3 text-right font-bold text-brand-600 dark:text-brand-400">R$ {totalPersonnel.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Resources */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Recursos Tecnológicos</h3>
            <button onClick={() => setShowResForm(s => !s)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 transition-colors font-semibold">
              <PlusIcon className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>

          {showResForm && (
            <form onSubmit={addResource} className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input required value={newRes.name} onChange={e => setNewRes(f => ({ ...f, name: e.target.value }))} placeholder="Nome do recurso *" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-white" />
              </div>
              <div>
                <input value={newRes.type} onChange={e => setNewRes(f => ({ ...f, type: e.target.value }))} placeholder="Tipo (ex: Infra)" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <input required type="number" min={0} value={newRes.cost || ''} onChange={e => setNewRes(f => ({ ...f, cost: Number(e.target.value) }))} placeholder="Custo R$" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-white" />
                <button type="submit" className="px-3 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 whitespace-nowrap">OK</button>
              </div>
            </form>
          )}

          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {resources.map(res => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{res.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{res.type}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800 dark:text-white">R$ {res.cost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeResource(res.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td colSpan={2} className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Total Recursos</td>
                <td className="px-6 py-3 text-right font-bold text-orange-600 dark:text-orange-400">R$ {totalResources.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex gap-3">
          <AlertIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <strong>Como é calculado:</strong> O custo de pessoal é a soma das horas de cada profissional multiplicada pela sua taxa horária por nível (Júnior, Pleno, Sênior). O total inclui também os recursos tecnológicos cadastrados.
          </p>
        </div>
      </div>
    </>
  );
}
