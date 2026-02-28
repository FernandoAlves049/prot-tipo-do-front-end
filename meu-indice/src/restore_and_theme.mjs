import fs from 'fs';

// 1. Restore App.jsx
fs.copyFileSync('../arquivo_para usar para refazer todo o projeto.txt', 'src/App.jsx');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 2. Add INITIAL PRODUCTS
const initialProductsJSON = fs.readFileSync('src/initialProducts.json', 'utf8');
const startIndex = code.indexOf('const initialProducts = [');
const endIndex = code.indexOf('];', startIndex) + 2;
code = code.substring(0, startIndex) + 'const initialProducts = ' + initialProductsJSON + ';' + code.substring(endIndex);

// 3. Fix CATEGORIES
const insertQuery = "const POSTO_CATEGORIES = ['Todos', 'Combustíveis', 'Outros'];";
const insertReplacement = insertQuery + "\nconst CATEGORIES = ['Todos', 'Alimentos', 'Hortifruti', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza', 'Combustíveis', 'Outros'];\n";
code = code.replace(insertQuery, insertReplacement);

// 4. Apply Theming
const themeObjCode = `
  // Temas dinâmicos por aba
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
    }
  };
  const theme = appThemes[activeTab];
`;

code = code.replace(
  '  const Header = () => (',
  themeObjCode + '\n\n  const Header = () => ('
);

code = code.replace(
  '<header className="bg-slate-900 text-white pt-6 pb-20 px-6">',
  '<header className={\`text-white pt-6 pb-20 px-6 transition-colors duration-500 \${theme.headerBg}\`}>'
);

code = code.replace(
  '<div className="p-2 bg-indigo-500 rounded-xl">',
  '<div className={\`p-2 rounded-xl shadow-lg transition-colors duration-500 \${theme.headerIconBg}\`}>'
);

code = code.replace(
  "activeTab === tab.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50'",
  "activeTab === tab.id ? \`\${theme.navActiveText} \${theme.navActiveBg}\` : \`text-slate-500 \${theme.navHoverText} hover:bg-slate-50\`"
);

code = code.replace(
  "tab.icon size={20} className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}",
  "tab.icon size={20} className={activeTab === tab.id ? theme.navActiveText : 'text-slate-400'}"
);

code = code.replace(
  '<div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />',
  '<div className={\`absolute bottom-0 left-0 right-0 h-1 rounded-t-full transition-colors duration-500 \${theme.navIndicator}\`} />'
);

code = code.replace(
  '<div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 selection:bg-indigo-100 selection:text-indigo-900">',
  '<div className={\`min-h-screen font-sans text-slate-900 pb-24 transition-colors duration-500 \${theme.appBg} \${theme.selection}\`}>'
);

// strip out trailing text instructions at bottom
code = code.replace(/^\\.\\nIf relevant.*/m, '');

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx fully restored, populated and themed!');
