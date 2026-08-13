const res = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ...'
  },
  body: JSON.stringify({
    name: 'Test Product',
    category: 'Routers',
    priceBDT: 5000,
    description: 'Test',
    seoKeywords: 'test',
    stock: 10,
    origin: 'Test',
    warranty: 'Test',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwJdd47K0CU1aEsxjSdGMF1pf6A0IAWTvPWinszN4wZA&s=10'
  })
});
console.log(await res.json());
