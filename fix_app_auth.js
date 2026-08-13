const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const res = await fetch\(([^,]+),\s*\{\s*method:\s*['"](POST|PATCH)['"],\s*headers:\s*\{\s*['"]?Content-Type['"]?:\s*['"]application\/json['"]\s*\}/g;

content = content.replace(regex, (match, url, method) => {
  return `const token = localStorage.getItem('token');\n      const res = await fetch(${url}, {\n        method: '${method}',\n        headers: {\n          'Content-Type': 'application/json',\n          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})\n        }`;
});

// also fix switch role
content = content.replace(
  /const res = await fetch\('\/api\/auth\/switch-role', \{\n\s*method: 'POST',\n\s*headers: \{ 'Content-Type': 'application\/json' \}/g,
  `const token = localStorage.getItem('token');\n      const res = await fetch('/api/auth/switch-role', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}) }`
);

fs.writeFileSync('src/App.tsx', content);
