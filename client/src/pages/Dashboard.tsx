import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="p-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Hoş geldin Buğra, mağazan bugün aktif.</p>
        </div>
        <button className="bg-[#ff6000] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          + Yeni Ürün Ekle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm">Toplam Ürün</p>
          <h3 className="text-3xl font-bold">{products.length}</h3>
        </div>
        {/* Diğer statik kartlar buraya... */}
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-6">Son Eklenen Ürünler</h2>
        {loading ? (
           <p className="text-center text-gray-400">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 6).map(p => (
              <div key={p.id} className="p-4 border border-gray-50 rounded-xl hover:border-orange-200 transition-all">
                <h4 className="font-bold">{p.name}</h4>
                <p className="text-[#ff6000] font-black">{p.price} TL</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}