import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useAppContext } from '../../context/AppContext';

export default function SignIn() {
  const { setIsLoggedIn, setGoogleUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    setGoogleUser({ name: 'Usuário', email: 'usuario@ifgoiano.edu.br', picture: '' });
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <>
      <PageMeta title="Login | Meu Índice de Preços" description="Faça login para acessar o Meu Índice de Preços." />
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md flex flex-col items-center">
          
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fillOpacity="0.9"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">Meu Índice de Preços</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 text-center">
            Sistema de gerenciamento de projetos e análise de preços
          </p>

          <button
            id="btn-entrar"
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl px-6 py-3.5 transition-all shadow-md hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            Entrar no sistema
          </button>

          <p className="text-xs text-slate-400 dark:text-gray-600 text-center mt-6 leading-relaxed">
            Protótipo acadêmico — IF Goiano · 4º Período
          </p>
        </div>
      </div>
    </>
  );
}
