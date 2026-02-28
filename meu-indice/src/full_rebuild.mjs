import fs from 'fs';

// Read original without BOM issues
let code = fs.readFileSync('../arquivo_para usar para refazer todo o projeto.txt', 'utf8');

// Strip BOM if present
if (code.charCodeAt(0) === 0xFEFF) {
    code = code.slice(1);
}

// 1. Replace initialProducts
const initialProductsJSON = fs.readFileSync('src/initialProducts.json', 'utf8');
const startIndex = code.indexOf('const initialProducts = [');
const endIndex = code.indexOf('];', startIndex) + 2;
code = code.substring(0, startIndex) + 'const initialProducts = ' + initialProductsJSON + ';' + code.substring(endIndex);

// 2. Add CATEGORIES after POSTO_CATEGORIES
const postoCatLine = "const POSTO_CATEGORIES = ['Todos', 'Combust";
const postoCatIdx = code.indexOf(postoCatLine);
if (postoCatIdx >= 0) {
    const endOfLine = code.indexOf('\n', postoCatIdx) + 1;
    code = code.substring(0, endOfLine) +
        "const CATEGORIES = ['Todos', 'Alimentos', 'Hortifruti', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza', 'Combust\u00edveis', 'Outros'];\n" +
        code.substring(endOfLine);
}

// 3. Add imports for Login and TaxesExplanationTab
const reactImport = "import React, { useState, useMemo, useRef, useEffect } from 'react';";
code = code.replace(
    reactImport,
    reactImport + "\nimport Login from './Login';\nimport TaxesExplanationTab from './TaxesExplanationTab';"
);

// 4. Add BookOpen to lucide imports
const storeImport = "  Store\n} from 'lucide-react';";
const storeImportCRLF = "  Store\r\n} from 'lucide-react';";
if (code.includes(storeImportCRLF)) {
    code = code.replace(storeImportCRLF, "  Store,\n  BookOpen\n} from 'lucide-react';");
} else {
    code = code.replace(storeImport, "  Store,\n  BookOpen\n} from 'lucide-react';");
}

// 5. Add isLoggedIn state
const appDecl = "export default function App() {";
const afterAppDecl = "\n  const [isLoggedIn, setIsLoggedIn] = useState(false);";
code = code.replace(appDecl, appDecl + afterAppDecl);

// 6. Update navTabs to include taxes tab
const oldNavTabs = "const navTabs = [\n      { id: 'dashboard', label: 'Painel e An";
const navTabsIdx = code.indexOf(oldNavTabs);
if (navTabsIdx >= 0) {
    const navEndIdx = code.indexOf('];', navTabsIdx) + 2;
    const newNavTabs = `const navTabs = [
      { id: 'dashboard', label: 'Painel e An\u00e1lises', icon: BarChart3 },
      { id: 'add', label: 'Novo Produto', icon: PlusCircle },
      { id: 'list', label: 'Lista de Compras', icon: ShoppingCart },
      { id: 'taxes', label: 'Info Impostos', icon: BookOpen }
    ];`;
    code = code.substring(0, navTabsIdx) + newNavTabs + code.substring(navEndIdx);
}

// 7. Inject theme system before Header component  
const headerMarker = "  const Header = () => (";
const themeCode = `
  // Temas din\u00e2micos por aba
  const appThemes = {
    dashboard: {
      appBg: 'bg-slate-50',
      selection: 'selection:bg-emerald-100 selection:text-emerald-900',
      headerBg: 'bg-slate-900',
      headerIconBg: 'bg-emerald-500 shadow-emerald-500/30',
      navActiveText: 'text-emerald-600',
      navHoverText: 'hover:text-emerald-500',
      navActiveBg: 'bg-emerald-50/50',
      navIndicator: 'bg-emerald-600'
    },
    add: {
      appBg: 'bg-violet-50',
      selection: 'selection:bg-violet-100 selection:text-violet-900',
      headerBg: 'bg-violet-950',
      headerIconBg: 'bg-violet-500 shadow-violet-500/30',
      navActiveText: 'text-violet-600',
      navHoverText: 'hover:text-violet-500',
      navActiveBg: 'bg-violet-50/50',
      navIndicator: 'bg-violet-600'
    },
    list: {
      appBg: 'bg-sky-50',
      selection: 'selection:bg-sky-100 selection:text-sky-900',
      headerBg: 'bg-sky-950',
      headerIconBg: 'bg-sky-500 shadow-sky-500/30',
      navActiveText: 'text-sky-600',
      navHoverText: 'hover:text-sky-500',
      navActiveBg: 'bg-sky-50/50',
      navIndicator: 'bg-sky-600'
    },
    taxes: {
      appBg: 'bg-amber-50',
      selection: 'selection:bg-amber-100 selection:text-amber-900',
      headerBg: 'bg-amber-950',
      headerIconBg: 'bg-amber-500 shadow-amber-500/30',
      navActiveText: 'text-amber-600',
      navHoverText: 'hover:text-amber-500',
      navActiveBg: 'bg-amber-50/50',
      navIndicator: 'bg-amber-600'
    }
  };
  const theme = appThemes[activeTab] || appThemes.dashboard;

`;
code = code.replace(headerMarker, themeCode + headerMarker);

// 8. Apply theme to header bg
const oldHeaderBg = '<header className="bg-slate-900 text-white pt-6 pb-20 px-6">';
code = code.replace(
    oldHeaderBg,
    '<header className={`text-white pt-6 pb-20 px-6 transition-colors duration-500 ${theme.headerBg}`}>'
);

// 9. Apply theme to icon div
const oldIconDiv = '<div className="p-2 bg-indigo-500 rounded-xl">';
code = code.replace(
    oldIconDiv,
    '<div className={`p-2 rounded-xl shadow-lg transition-colors duration-500 ${theme.headerIconBg}`}>'
);

// 10. Apply theme to nav active state
const oldNavActive = "activeTab === tab.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50'";
code = code.replace(
    oldNavActive,
    "activeTab === tab.id ? `${theme.navActiveText} ${theme.navActiveBg}` : `text-slate-500 ${theme.navHoverText} hover:bg-slate-50`"
);

// 11. Apply theme to nav icon
const oldNavIcon = "tab.icon size={20} className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}";
code = code.replace(
    oldNavIcon,
    "tab.icon size={20} className={activeTab === tab.id ? theme.navActiveText : 'text-slate-400'}"
);

// 12. Apply theme to nav indicator
const oldNavIndicator = '<div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />';
code = code.replace(
    oldNavIndicator,
    '<div className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full transition-colors duration-500 ${theme.navIndicator}`} />'
);

// 13. Replace main return with login check + theming
const oldReturn = '  return (\n    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 selection:bg-indigo-100 selection:text-indigo-900">';
const oldReturnCRLF = '  return (\r\n    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 selection:bg-indigo-100 selection:text-indigo-900">';
const newReturn = `  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={\`min-h-screen font-sans text-slate-900 pb-24 transition-colors duration-500 \${theme.appBg} \${theme.selection}\`}>`;

if (code.includes(oldReturnCRLF)) {
    code = code.replace(oldReturnCRLF, newReturn);
} else {
    code = code.replace(oldReturn, newReturn);
}

// 14. Add taxes tab render with animations
const tabDashIdx = code.indexOf("{activeTab === 'dashboard' && <DashboardTab />}");
if (tabDashIdx >= 0) {
    const tabListEnd = code.indexOf("{activeTab === 'list' && <ShoppingListTab />}") + "{activeTab === 'list' && <ShoppingListTab />}".length;
    code = code.substring(0, tabDashIdx) +
        `{activeTab === 'dashboard' && <div className="animate-slide-in-left"><DashboardTab /></div>}
        {activeTab === 'add' && <div className="animate-slide-up"><AddProductTab /></div>}
        {activeTab === 'list' && <div className="animate-slide-in-right"><ShoppingListTab /></div>}
        {activeTab === 'taxes' && <div className="animate-fade-scale"><TaxesExplanationTab /></div>}` +
        code.substring(tabListEnd);
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('App.jsx fully and cleanly rebuilt!');
