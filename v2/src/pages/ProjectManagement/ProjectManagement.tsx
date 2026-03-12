import PageMeta from "../../components/common/PageMeta";
import { TaskIcon, GridIcon, PaperPlaneIcon, DocsIcon, PlugInIcon } from "../../icons";

export default function ProjectManagement() {
  const objectives = [
    { icon: <GridIcon className="text-blue-500" />, title: "Interfaces de Usuário (IU)", desc: "Desenvolvimento em HTML/CSS (Bootstrap/Tailwind)" },
    { icon: <PaperPlaneIcon className="text-orange-500" />, title: "Slides e Seminário", desc: "Preparação da entrega e apresentação" },
    { icon: <DocsIcon className="text-indigo-500" />, title: "Trabalho Escrito", desc: "Formato Artigo SBC no Overleaf/LaTeX" },
    { icon: <PlugInIcon className="text-emerald-500" />, title: "Casos de Uso", desc: "Conexão da IU com a lógica do sistema" },
  ];

  return (
    <>
      <PageMeta title="Gerenciamento de Projetos | Meu Índice de Preços" description="Visão geral dos objetivos do projeto." />
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TaskIcon className="w-6 h-6 text-brand-500" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Gerenciamento de Projetos</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Este módulo centraliza o controle das fases do projeto, desde a definição de interfaces até o cálculo financeiro final.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-2xl">
                {obj.icon}
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">{obj.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{obj.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-50 dark:bg-brand-900/10 rounded-2xl p-8 border border-brand-100 dark:border-brand-900/20">
          <h2 className="text-lg font-bold text-brand-900 dark:text-brand-400 mb-4">Próximos Passos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <p className="font-bold text-brand-900 dark:text-brand-300">Profissionais</p>
                <p className="text-sm text-brand-700 dark:text-brand-500">Defina papéis e remunerações</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <p className="font-bold text-brand-900 dark:text-brand-300">Tarefas</p>
                <p className="text-sm text-brand-700 dark:text-brand-500">Registre horas por profissional</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <p className="font-bold text-brand-900 dark:text-brand-300">Financeiro</p>
                <p className="text-sm text-brand-700 dark:text-brand-500">Calcule o custo total e recursos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
