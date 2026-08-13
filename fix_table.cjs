const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Add "Actions" column
content = content.replace(
  '<th className="p-3">Unit Cost (BDT)</th>\n                  </tr>',
  '<th className="p-3">Unit Cost (BDT)</th>\n                    <th className="p-3 text-right">Actions</th>\n                  </tr>'
);

// Add buttons
const actionsCell = `
                      <td className="p-3 text-right space-x-2">
                        <button 
                          onClick={() => handleEditProductClick(p)} 
                          className="px-2 py-1 bg-slate-800 text-cyan-400 hover:text-white rounded text-[10px] font-bold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id, p.name)} 
                          className="px-2 py-1 bg-rose-950/50 border border-rose-900/50 text-rose-400 hover:bg-rose-900 hover:text-white rounded text-[10px] font-bold"
                        >
                          Del
                        </button>
                      </td>
                    </tr>
`;

content = content.replace(
  /<td className="p-3 text-slate-200 font-mono">৳\{p\.priceBDT\.toLocaleString\('en-IN'\)\}<\/td>\n\s*<\/tr>/g,
  `<td className="p-3 text-slate-200 font-mono">৳{p.priceBDT.toLocaleString('en-IN')}</td>${actionsCell}`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
