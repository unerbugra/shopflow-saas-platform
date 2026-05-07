import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}


export default function App() { 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });
  }, []);

  if (loading) return <p className="p-10">Yükleniyor...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ürün Listesi</h1>
      <ul className="list-disc pl-5">
        {products.map((product) => (
          <li key={product.id} className="py-1">
            {product.name} - <span className="font-bold">{product.price} TL</span>
          </li>
        ))}
      </ul>
    </div>
  );
}