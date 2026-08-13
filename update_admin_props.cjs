const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  '  onAddProductSuccess?: (product: Product) => void;\n}',
  `  onAddProductSuccess?: (product: Product) => void;
  onUpdateProductSuccess?: (product: Product) => void;
  onDeleteProductSuccess?: (productId: string) => void;
}`
);

content = content.replace(
  '  onAddProductSuccess\n}) => {',
  `  onAddProductSuccess,
  onUpdateProductSuccess,
  onDeleteProductSuccess
}) => {`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
