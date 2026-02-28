import fs from 'fs';

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Imports
const importsToAdd = `
import Login from './Login';
import TaxesExplanationTab from './TaxesExplanationTab';
`;
if (!code.includes('import Login from')) {
    code = code.replace(
        'import React, { useState, useMemo, useRef, useEffect } from \'react\';',
        `import React, { useState, useMemo, useRef, useEffect } from 'react';\n${importsToAdd}`
    );
}

if (!code.includes('BookOpen')) {
    code = code.replace('} from \'lucide-react\';', '  BookOpen\n} from \'lucide-react\';');
}

// 2. Login State
const loginStateCode = `
  const [isLoggedIn, setIsLoggedIn] = useState(false);
`;
if (!code.includes('const [isLoggedIn,')) {
    code = code.replace(
        'export default function App() {',
        `export default function App() {\n${loginStateCode}`
    );
}

// 3. New Nav Tab
const navReplacement = `
    const navTabs = [
      { id: 'dashboard', label: 'Painel e Análises', icon: BarChart3 },
      { id: 'add', label: 'Novo Produto', icon: PlusCircle },
      { id: 'list', label: 'Lista de Compras', icon: ShoppingCart },
      { id: 'taxes', label: 'Info Impostos', icon: BookOpen }
    ];
`;
code = code.replace(
    `    const navTabs = [
      { id: 'dashboard', label: 'Painel e Análises', icon: BarChart3 },
      { id: 'add', label: 'Novo Produto', icon: PlusCircle },
      { id: 'list', label: 'Lista de Compras', icon: ShoppingCart }
    ];`,
    navReplacement
);

// 4. Register Theme
const taxesTheme = `
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
  };`;
code = code.replace(
    `    }
  };
  const theme = appThemes[activeTab];`,
    taxesTheme + `\n  const theme = appThemes[activeTab] || appThemes.dashboard;`
);

// 5. Render Login conditional
const renderBlock = `
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
`;
code = code.replace('  return (\n    <div className={`min-h-screen', renderBlock + '    <div className={`min-h-screen');


// 6. Hook components to render
const tabRenders = `
        {activeTab === 'dashboard' && <div className="animate-slide-in-left"><DashboardTab /></div>}
        {activeTab === 'add' && <div className="animate-slide-up"><AddProductTab /></div>}
        {activeTab === 'list' && <div className="animate-slide-in-right"><ShoppingListTab /></div>}
        {activeTab === 'taxes' && <div className="animate-fade-scale"><TaxesExplanationTab /></div>}
      </main>
`;
code = code.replace(
    `        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'add' && <AddProductTab />}
        {activeTab === 'list' && <ShoppingListTab />}
      </main>`,
    tabRenders
);

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx patched successfully for Login, TaxesTab and Animations!');
