const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  'onSubmit={handleCreateProduct}',
  'onSubmit={handleSubmitProduct}'
);

content = content.replace(
  '<h3 className="text-lg font-black text-white">নতুন প্রোডাক্ট আপলোড • Upload Product</h3>',
  '<h3 className="text-lg font-black text-white">{editingProductId ? "প্রোডাক্ট আপডেট • Edit Product" : "নতুন প্রোডাক্ট আপলোড • Upload Product"}</h3>'
);

content = content.replace(
  '<button\n                onClick={() => {\n                  setShowProductModal(true);\n                  setErrorMsg(\'\');\n                  setSuccessMsg(\'\');\n                }}',
  `<button
                onClick={() => {
                  setEditingProductId(null);
                  setProdName('');
                  setProdPriceBDT('');
                  setProdDescription('');
                  setProdSeoKeywords('');
                  setProdStock('10');
                  setProdOrigin('Shenzhen Direct');
                  setProdWarranty('1 Year BTRC Approved Warranty');
                  setProdImage('');
                  setShowProductModal(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}`
);

content = content.replace(
  'প্রোডাক্ট ডাটাবেজে আপলোড করুন (Publish Product)',
  '{editingProductId ? "আপডেট করুন (Update Product)" : "প্রোডাক্ট ডাটাবেজে আপলোড করুন (Publish Product)"}'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
