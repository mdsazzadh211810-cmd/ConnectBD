const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsPage.tsx', 'utf8');

content = content.replace(
  'onClick={() => onAddToCart?.(product)}\n                    className="py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm"',
  'onClick={() => onAddToCart?.(product)}\n                    disabled={product.stock === 0}\n                    className="py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm disabled:cursor-not-allowed"'
);

fs.writeFileSync('src/components/ProductsPage.tsx', content);
