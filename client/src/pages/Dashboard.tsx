import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
}

export default function Dashboard() {
  const [productList, setProductList] = useState<Product[]>([]);
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock_quantity: '' });
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(res => res.json())
      .then(data => {
        setProductList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Ürün başarıyla eklendi:', data);
        setProductList(prev => [data, ...prev]);
        setNewProduct({ name: '', description: '', price: '', stock_quantity: '' });
        setShowForm(false);
      })
      .catch(err => console.error('Hata:', err));
  };

  return (
    <main className="p-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Hoş geldin Buğra, mağazan bugün aktif.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#ff6000] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          + Yeni Ürün Ekle
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <form 
      onSubmit={handleSubmit} 
      className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 transform transition-all animate-in fade-in zoom-in duration-300"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Yeni Ürün Ekle</h3>
        <p className="text-gray-500 text-sm">Lütfen ürün detaylarını eksiksiz giriniz.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
          <input 
            name="name" 
            value={newProduct.name} 
            onChange={handleChange} 
            placeholder="Örn: Kablosuz Mouse" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6000] focus:ring-2 focus:ring-[#ff6000]/20 outline-none transition-all placeholder:text-gray-400" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <input 
            name="description" 
            value={newProduct.description} 
            onChange={handleChange} 
            placeholder="Ürün özelliklerinden bahsedin..." 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6000] focus:ring-2 focus:ring-[#ff6000]/20 outline-none transition-all placeholder:text-gray-400" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
            <input 
              name="price" 
              type="number"
              value={newProduct.price} 
              onChange={handleChange} 
              placeholder="0.00" 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6000] focus:ring-2 focus:ring-[#ff6000]/20 outline-none transition-all placeholder:text-gray-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
            <input 
              name="stock_quantity" 
              type="number"
              value={newProduct.stock_quantity} 
              onChange={handleChange} 
              placeholder="0" 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6000] focus:ring-2 focus:ring-[#ff6000]/20 outline-none transition-all placeholder:text-gray-400" 
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button 
          type="submit" 
          className="w-full bg-[#ff6000] hover:bg-[#e65600] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
        >
          Ürünü Kaydet
        </button>
        <button 
          type="button" 
          onClick={() => setShowForm(false)} 
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl transition-all"
        >
          Vazgeç
        </button>
      </div>
    </form>
  </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm">Toplam Ürün</p>
          <h3 className="text-3xl font-bold">{productList.length}</h3>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-6">Son Eklenen Ürünler</h2>
        {loading ? (
          <p className="text-center text-gray-400">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productList.slice(0, 6).map((p) => (
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