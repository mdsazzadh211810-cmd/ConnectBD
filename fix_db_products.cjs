const fs = require('fs');

let content = fs.readFileSync('src/server/db.ts', 'utf8');

const newMethods = `
  public updateProduct(id: string, updates: Partial<Product>) {
    const p = this.findProductById(id);
    if (p) {
      Object.assign(p, updates);
      if (updates.stock !== undefined) {
        p.inStock = p.stock > 0;
      }
      this.save();
      return p;
    }
    return undefined;
  }

  public deleteProduct(id: string) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }
`;

content = content.replace(
  /public addProduct\(product: Product\) \{[\s\S]*?this\.save\(\);\s*\}/,
  `public addProduct(product: Product) {
    this.data.products.unshift(product);
    this.save();
  }
${newMethods}`
);

fs.writeFileSync('src/server/db.ts', content);
