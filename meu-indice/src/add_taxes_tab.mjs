import fs from 'fs';
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Find the list tab and add taxes after it
const listTabStr = "{ id: 'list', icon: ShoppingCart, label: 'Lista de Compras' }";
const listIdx = code.indexOf(listTabStr);
if (listIdx < 0) { console.log('NOT FOUND: list tab'); process.exit(1); }

// Replace the list tab line: add comma and new taxes line
code = code.substring(0, listIdx + listTabStr.length) +
    ",\n          { id: 'taxes', icon: BookOpen, label: 'Info Impostos' }" +
    code.substring(listIdx + listTabStr.length);

// Now add the TaxesExplanationTab render if missing
if (!code.includes("activeTab === 'taxes'")) {
    const shoppingListRender = "{activeTab === 'list' && <ShoppingListTab />}";
    const shoppingListRenderWithAnim = `{activeTab === 'list' && <div className="animate-slide-in-right"><ShoppingListTab /></div>}`;
    const shoppingListRenderDiv = "<ShoppingListTab /></div>}";

    // Find where list tab renders end
    let listRenderIdx = code.indexOf(shoppingListRenderWithAnim);
    if (listRenderIdx < 0) listRenderIdx = code.indexOf(shoppingListRender);

    if (listRenderIdx >= 0) {
        const endOfListRender = code.indexOf("\n", listRenderIdx) + 1;
        code = code.substring(0, endOfListRender) +
            `        {activeTab === 'taxes' && <div className="animate-fade-scale"><TaxesExplanationTab /></div>}\n` +
            code.substring(endOfListRender);
    } else {
        console.log('Could not find list render - trying alternative');
        // Try to find ShoppingListTab closing
        const shoppingClose = "<ShoppingListTab />";
        const shoppingCloseIdx = code.lastIndexOf(shoppingClose);
        if (shoppingCloseIdx > 0) {
            const endLine = code.indexOf("\n", shoppingCloseIdx) + 1;
            code = code.substring(0, endLine) +
                "        {activeTab === 'taxes' && <div className=\"animate-fade-scale\"><TaxesExplanationTab /></div>}\n" +
                code.substring(endLine);
        }
    }
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Taxes tab added to nav and render!');
