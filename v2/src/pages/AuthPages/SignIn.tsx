import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';

export default function SignIn() {
  const { setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <>
      <PageMeta title="Login | Meu Índice de Preços" description="Faça login para acessar o Meu Índice de Preços." />
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md flex flex-col items-center">
          {/* Google Logo */}
          <div className="flex gap-1 mb-4 select-none">
            <span className="text-4xl font-bold text-[#4285F4]">G</span>
            <span className="text-4xl font-bold text-[#EA4335]">o</span>
            <span className="text-4xl font-bold text-[#FBBC05]">o</span>
            <span className="text-4xl font-bold text-[#4285F4]">g</span>
            <span className="text-4xl font-bold text-[#34A853]">l</span>
            <span className="text-4xl font-bold text-[#EA4335]">e</span>
          </div>

          <h1 className="text-2xl font-medium text-slate-800 dark:text-white mb-2 tracking-tight">Fazer login</h1>
          <p className="text-base text-slate-600 dark:text-gray-400 mb-8 text-center">
            Ir para <span className="font-medium text-slate-800 dark:text-white">Meu Índice de Preços</span>
          </p>

          <div className="w-full space-y-4 mb-10">
            <input
              type="email"
              placeholder="E-mail ou telefone"
              className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-[4px] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-base transition-all"
            />
            <div className="flex justify-start">
              <button className="text-[#1a73e8] hover:text-blue-800 text-sm font-medium tracking-wide">
                Esqueceu seu e-mail?
              </button>
            </div>
          </div>

          <div className="text-sm text-slate-600 dark:text-gray-400 w-full mb-12">
            Não está no seu computador? Use o modo visitante para fazer login com privacidade.{' '}
            <button className="text-[#1a73e8] font-medium hover:text-blue-800 tracking-wide">Saiba mais</button>
          </div>

          <div className="w-full flex justify-between items-center">
            <button className="text-[#1a73e8] hover:text-blue-800 text-sm font-medium tracking-wide">
              Criar conta
            </button>
            <button
              onClick={handleLogin}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2 rounded-[4px] font-medium transition-colors shadow-sm focus:bg-blue-800"
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
