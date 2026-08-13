const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsPage.tsx', 'utf8');

const regex = /<div className="absolute top-2 right-2 bg-emerald-950\/90 text-emerald-300 text-\[10px\] font-bold px-2 py-0\.5 rounded border border-emerald-800\/60">\s*\{product\.stock > 0 \? `\$\{product\.stock\} In Stock` : 'Backorder'\}\s*<\/div>/g;

const replacement = `{product.stock > 0 ? (
                    <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800/60">
                      {product.stock} In Stock
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-rose-950/90 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-800/60">
                      Out of Stock
                    </div>
                  )}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/ProductsPage.tsx', content);
