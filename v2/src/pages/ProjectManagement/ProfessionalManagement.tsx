import { useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { GroupIcon, PlusIcon, TrashBinIcon, PencilIcon, CheckLineIcon, CloseLineIcon } from "../../icons";
import { useAppContext, Professional, Role } from "../../context/AppContext";

const ROLES: Role[] = ['Júnior', 'Pleno', 'Sênior'];

const ROLE_DEFAULT_RATES: Record<Role, number> = {
  'Júnior': 60,
  'Pleno': 100,
  'Sênior': 150,
};

const ROLE_COLORS: Record<Role, string> = {
  'Júnior': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Pleno': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Sênior': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const empty = (): Omit<Professional, 'id'> => ({ name: '', role: 'Júnior', hourlyRate: ROLE_DEFAULT_RATES['Júnior'] });

export default function ProfessionalManagement() {
  const { professionals, setProfessionals } = useAppContext();
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleRoleChange = (role: Role) => {
    setForm(f => ({ ...f, role, hourlyRate: ROLE_DEFAULT_RATES[role] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      setProfessionals(ps => ps.map(p => p.id === editId ? { ...p, ...form } : p));
      setEditId(null);
    } else {
      setProfessionals(ps => [...ps, { ...form, id: Date.now().toString() }]);
    }
    setForm(empty());
    setShowForm(false);
  };

  const startEdit = (pro: Professional) => {
    setForm({ name: pro.name, role: pro.role, hourlyRate: pro.hourlyRate });
    setEditId(pro.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProfessionals(ps => ps.filter(p => p.id !== id));
  };

  const cancel = () => {
    setForm(empty());
    setEditId(null);
    setShowForm(false);
  };

  return (
    <>
      <PageMeta title="Profissionais | Gerenciamento de Projetos" description="Cadastro de profissionais, papéis e remuneração." />
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <GroupIcon className="w-6 h-6 text-brand-500" />
            Profissionais e Papéis
          </h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-sm font-semibold">
              <PlusIcon className="w-4 h-4" />
              Novo Profissional
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-brand-200 dark:border-brand-900/40 p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 dark:text-white mb-5 text-base">
              {editId ? 'Editar Profissional' : 'Cadastrar Novo Profissional'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Nome completo *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Fernando Alves"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Nível / Papel *</label>
                <select
                  value={form.role}
                  onChange={e => handleRoleChange(e.target.value as Role)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Taxa Horária (R$/h) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.hourlyRate}
                  onChange={e => setForm(f => ({ ...f, hourlyRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="sm:col-span-3 flex gap-3 pt-1">
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors text-sm font-semibold">
                  <CheckLineIcon className="w-4 h-4" />
                  {editId ? 'Salvar alterações' : 'Cadastrar'}
                </button>
                <button type="button" onClick={cancel} className="flex items-center gap-2 px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                  <CloseLineIcon className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rate reference card */}
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map(role => (
            <div key={role} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${ROLE_COLORS[role]}`}>{role}</span>
              <p className="text-xs text-gray-400">Taxa padrão</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">R$ {ROLE_DEFAULT_RATES[role]}/h</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Profissionais cadastrados ({professionals.length})</p>
          </div>
          {professionals.length === 0 ? (
            <div className="py-16 text-center">
              <GroupIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nenhum profissional cadastrado.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Nome</th>
                  <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Papel</th>
                  <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase text-right">R$/h</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {professionals.map(pro => (
                  <tr key={pro.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{pro.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[pro.role]}`}>{pro.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800 dark:text-white">R$ {pro.hourlyRate.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => startEdit(pro)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pro.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
