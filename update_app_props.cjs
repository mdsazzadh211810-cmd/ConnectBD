const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '            onAddProductSuccess={(newProd) => setProducts(prev => [newProd, ...prev])}',
  `            onAddProductSuccess={(newProd) => setProducts(prev => [newProd, ...prev])}
            onUpdateProductSuccess={(updatedProd) => setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p))}
            onDeleteProductSuccess={(productId) => setProducts(prev => prev.filter(p => p.id !== productId))}`
);

fs.writeFileSync('src/App.tsx', content);
