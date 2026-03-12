import { useState, useMemo } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { ListIcon, PlusIcon, TrashBinIcon, TimeIcon } from "../../icons";
import { useAppContext, TaskEntry } from "../../context/AppContext";

const today = () => new Date().toISOString().slice(0, 10);

const emptyEntry = (professionalId: string = ''): Omit<TaskEntry, 'id'> => ({
  professionalId,
  task: '',
  hours: 1,
  date: today(),
});

export default function TaskTracking() {
  const { professionals, taskEntries, setTaskEntries } = useAppContext();
  const [form, setForm] = useState(emptyEntry(professionals[0]?.id ?? ''));
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.task.trim() || !form.professionalId) return;
    setTaskEntries(ts => [...ts, { ...form, id: Date.now().toString() }]);
    setForm(emptyEntry(form.professionalId));
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTaskEntries(ts => ts.filter(t => t.id !== id));
  };

  // Group totals by professional
  const hoursByPro = useMemo(() => {
    const map: Record<string, number> = {};
    taskEntries.forEach(e => {
      map[e.professionalId] = (map[e.professionalId] || 0) + e.hours;
    });
    return map;
  }, [taskEntries]);

  const totalHours = Object.values(hoursByPro).reduce((a, b) => a + b, 0);

  const getProfName = (id: string) => professionals.find(p => p.id === id)?.name ?? '—';

  return (
    <>
      <PageMeta title="Ordem de Serviço | Gerenciamento de Projetos" description="Registro de tarefas e horas por profissional." />
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ListIcon className="w-6 h-6 text-brand-500" />
            Ordem de Serviço (OS)
          </h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-sm font-semibold">
              <PlusIcon className="w-4 h-4" />
              Registrar Horas
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-brand-200 dark:border-brand-900/40 p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 dark:text-white mb-5 text-base">Nova OS — Registro de Horas</h2>
            {professionals.length === 0 ? (
              <p className="text-amber-600 dark:text-amber-400 text-sm">⚠️ Cadastre ao menos um profissional antes de registrar horas.</p>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Profissional *</label>
                  <select
                    required
                    value={form.professionalId}
                    onChange={e => setForm(f => ({ ...f, professionalId: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {professionals.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Horas *</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    required
                    value={form.hours}
                    onChange={e => setForm(f => ({ ...f, hours: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Descrição da tarefa *</label>
                  <input
                    required
                    value={form.task}
                    onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                    placeholder="Ex: Desenvolvimento da tela de login"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="sm:col-span-4 flex gap-3 pt-1">
                  <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors text-sm font-semibold">
                    <TimeIcon className="w-4 h-4" />
                    Registrar
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Registros de OS ({taskEntries.length})</p>
            </div>
            {taskEntries.length === 0 ? (
              <div className="py-16 text-center">
                <TimeIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Nenhuma OS registrada.</p>
                <p className="text-gray-400 text-sm mt-1">Clique em "Registrar Horas" para começar.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Data</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Profissional</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Tarefa</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase text-right">Horas</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {[...taskEntries].sort((a, b) => b.date.localeCompare(a.date)).map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{entry.date}</td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-white whitespace-nowrap">{getProfName(entry.professionalId)}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{entry.task}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="flex items-center gap-1 justify-end font-bold text-brand-600 dark:text-brand-400">
                          <TimeIcon className="w-3.5 h-3.5" />
                          {entry.hours}h
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary per professional */}
          <div className="space-y-4">
            <div className="bg-brand-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-white/70 text-sm mb-1">Total de Horas</p>
              <p className="text-4xl font-bold">{totalHours}h</p>
              <div className="mt-4 pt-4 border-t border-white/20 text-sm text-white/70">
                {taskEntries.length} OS registrada{taskEntries.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-sm">Horas por Profissional</h3>
              {professionals.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum profissional cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {professionals.map(p => {
                    const hrs = hoursByPro[p.id] ?? 0;
                    const pct = totalHours > 0 ? Math.round((hrs / totalHours) * 100) : 0;
                    return (
                      <div key={p.id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-600 dark:text-gray-400 font-medium truncate">{p.name}</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300 ml-2 whitespace-nowrap">{hrs}h ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
