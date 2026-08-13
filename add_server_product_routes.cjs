const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const newRoutes = `
app.put('/api/products/:id', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin' && user.role !== 'operations') {
      return res.status(403).json({ success: false, message: 'Only Admins can edit products.' });
    }

    const { id } = req.params;
    const updates = req.body;
    
    // Check if product exists
    const existingProduct = db.findProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Prepare updates
    const safeUpdates: any = {};
    if (updates.name !== undefined) safeUpdates.name = updates.name;
    if (updates.category !== undefined) safeUpdates.category = updates.category;
    if (updates.priceBDT !== undefined) safeUpdates.priceBDT = Number(updates.priceBDT);
    if (updates.stock !== undefined) {
      safeUpdates.stock = Number(updates.stock);
      safeUpdates.inStock = safeUpdates.stock > 0;
    }
    if (updates.image !== undefined) safeUpdates.image = updates.image;
    if (updates.description !== undefined) safeUpdates.description = updates.description;
    if (updates.seoKeywords !== undefined) safeUpdates.seoKeywords = updates.seoKeywords;

    const updated = db.updateProduct(id, safeUpdates);

    db.addAuditLog(
      user.email,
      user.role,
      'Product Updated',
      \`Product updated: \${updated?.name}\`,
      getClientIp(req)
    );

    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin' && user.role !== 'operations') {
      return res.status(403).json({ success: false, message: 'Only Admins can delete products.' });
    }

    const { id } = req.params;
    const existingProduct = db.findProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    db.deleteProduct(id);

    db.addAuditLog(
      user.email,
      user.role,
      'Product Deleted',
      \`Product deleted: \${existingProduct.name}\`,
      getClientIp(req)
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
`;

content = content.replace(
  /app\.post\('\/api\/products'[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: err\.message \|\| 'Failed to create product' \}\);\n  \}\n\}\);/g,
  match => match + "\n" + newRoutes
);

// Fallback logic if the exact replace match fails
if (content.indexOf("app.delete('/api/products/:id'") === -1) {
  content = content.replace(
    /app\.get\('\/api\/packages'/g,
    match => newRoutes + "\n" + match
  );
}

fs.writeFileSync('server.ts', content);
