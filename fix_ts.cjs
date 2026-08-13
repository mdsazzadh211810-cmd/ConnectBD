const fs = require('fs');

const files = [
  'src/components/SmartNetworkPlanner.tsx',
  'src/components/AdminDashboard.tsx',
  'src/components/CheckoutModal.tsx',
  'src/components/QuoteModal.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix spread
  content = content.replace(/headers:\s*\{\s*'Content-Type':\s*'application\/json',\s*\.\.\.\(token \? \{ 'Authorization': `Bearer \$\{token\}` \} : \{\}\)\s*\}/g, "headers: {\n          'Content-Type': 'application/json',\n          ...(token ? { 'Authorization': `Bearer ${token}` } : {})\n        } as Record<string, string>");

  // Fix ternary
  content = content.replace(/headers:\s*token \? \{ 'Authorization': `Bearer \$\{token\}` \} : \{\}/g, "headers: (token ? { 'Authorization': `Bearer ${token}` } : {}) as Record<string, string>");

  // Fix syncAuthenticatedData in App.tsx
  content = content.replace(/const headers = token \? \{ 'Authorization': `Bearer \$\{token\}` \} : \{\};/g, "const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};");

  fs.writeFileSync(file, content);
}
