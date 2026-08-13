const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const stateCode = `  const [editingProductId, setEditingProductId] = useState<string | null>(null);`;

content = content.replace(
  "  const [successMsg, setSuccessMsg] = useState('');",
  "  const [successMsg, setSuccessMsg] = useState('');\n" + stateCode
);

const newHandlers = `
  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPriceBDT(product.priceBDT.toString());
    setProdDescription(product.description || '');
    setProdSeoKeywords(product.seoKeywords || '');
    setProdStock(product.stock.toString());
    setProdOrigin(product.origin || '');
    setProdWarranty(product.warranty || '');
    setProdImage(product.image || '');
    setShowProductModal(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(\`Are you sure you want to delete "\${name}"? This action cannot be undone.\`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(\`/api/products/\${id}\`, {
        method: 'DELETE',
        headers: { ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}) } as Record<string, string>
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete');
      if (onDeleteProductSuccess) onDeleteProductSuccess(id);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingProductId ? \`/api/products/\${editingProductId}\` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
        } as Record<string, string>,
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          priceBDT: parseFloat(prodPriceBDT) || 0,
          description: prodDescription,
          seoKeywords: prodSeoKeywords,
          stock: parseInt(prodStock, 10) || 0,
          origin: prodOrigin,
          warranty: prodWarranty,
          image: prodImage || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save product');
      }

      setSuccessMsg(\`Product "\${data.product.name}" \${editingProductId ? 'updated' : 'uploaded'} successfully!\`);
      
      if (editingProductId) {
        if (onUpdateProductSuccess) onUpdateProductSuccess(data.product);
      } else {
        if (onAddProductSuccess) onAddProductSuccess(data.product);
      }

      setTimeout(() => {
        setShowProductModal(false);
        setEditingProductId(null);
        setProdName('');
        setProdPriceBDT('');
        setProdDescription('');
        setProdSeoKeywords('');
        setSuccessMsg('');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(
  /const handleCreateProduct = async \(e: React\.FormEvent\) => \{[\s\S]*?setLoading\(false\);\n    \}\n  \};/,
  newHandlers
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
