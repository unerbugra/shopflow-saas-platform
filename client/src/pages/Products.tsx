import { useState, useEffect } from 'react';
import Modal from 'react-modal'; 
import ProductDetailModal from '../components/ProductDetailModal';


interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
}

export default function Products() {
  
  const [productList, setProductList] = useState<Product[]>([]);
    
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock_quantity: '' });
    
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents page refresh
    console.log("Submitted Name:", newProduct.name);

    const isEditing = editingProductId !== null;
    const url = isEditing 
    ? `http://localhost:5001/api/products/${editingProductId}` 
    : 'http://localhost:5001/api/products';
  const method = isEditing ? 'PUT' : 'POST';
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
     .then(res => {
      if (!res.ok) throw new Error("İşlem başarısız");
      return res.json();
    })
    .then(data => {
      if (isEditing) {
        console.log('Ürün başarıyla güncellendi:', data);
        setProductList(prev => prev.map(p => p.id === editingProductId ? data : p));
      } else {
        console.log('Ürün başarıyla eklendi:', data);
        setProductList(prev => [data, ...prev]);
      }

      // Formu ve hafızayı temizle
      setNewProduct({ name: '', description: '', price: '', stock_quantity: '' });
      setEditingProductId(null); // Düzenleme modundan çık
      setShowForm(false);
    })
    .catch(err => console.error('Hata:', err));
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
    // Implement edit functionality here
    setEditingProductId(product.id);
    setShowForm(true);
    setNewProduct({
      ...newProduct,
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity
    });
  }

  const handleDelete = (id: number) => {
    console.log("Delete product with ID:", id);   
    setDeletingProductId(id);
    fetch(`http://localhost:5001/api/products/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      return res.json();
    })
    .then(data => {
      console.log('Ürün başarıyla silindi:', data);
      setProductList(prevProducts => prevProducts.filter(product => product.id !== id));
      setDeletingProductId(null);
    })
    .catch(err => {
      console.error('Hata:', err);
      setDeletingProductId(null);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setProductList(json);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      {/* Üst Başlık ve İstatistik Özeti */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tüm Ürünler</h1>
          <p className="text-gray-500 mt-1.5 font-medium">
            Toplam <span className="text-[#ff6000]">{productList.length}</span> adet ürün listeleniyor.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            Dışa Aktar (Excel)
          </button>
          <button 
            className="bg-[#ff6000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#e65600] transition-all shadow-lg shadow-orange-100"
            onClick={() => setShowForm(true)}
          >
            + Yeni Ürün
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
        onClick={() => {
          setShowForm(false);
          setEditingProductId(null);
          setNewProduct({ name: '', description: '', price: '', stock_quantity: '' });
  }} 
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl transition-all"
>
  Vazgeç
</button>
      </div>
    </form>
  </div>
        )}
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6000]"></div>
        </div>
      ) : (
        /* Ürün Kartları Container */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {productList.map((product: Product) => (
            <div onClick={() => setSelectedProduct(product)} 
              key={product.id} 
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-orange-200 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    Number(product.stock_quantity) > 0 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {Number(product.stock_quantity) > 0 ? 'Stokta' : 'Tükendi'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#ff6000] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                  {product.description || 'Açıklama belirtilmemiş.'}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Birim Fiyat</p>
                    <p className="text-2xl font-black text-gray-900 leading-none mt-1">
                      {product.price} <span className="text-sm font-bold">TL</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Stok</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">{product.stock_quantity} Adet</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-4">
                  <button 
    onClick={(e) => { 
      e.stopPropagation(); // <-- Sihirli dokunuş: Tıklamanın karta sıçramasını engeller!
      handleEdit(product); 
    }} 
    className="text-gray-500 text-sm font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors"
  >
    Düzenle
  </button>
  
  <button 
    onClick={(e) => { 
      e.stopPropagation(); // <-- Sihirli dokunuş: Tıklamanın karta sıçramasını engeller!
      handleDelete(product.id); 
    }} 
    className="text-red-500 text-sm font-bold py-2 rounded-lg hover:bg-red-50 transition-colors"
  >
    Sil
  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && productList.length === 0 && (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800">Henüz ürün eklemedin</h2>
          <p className="text-gray-500 mt-2">Satış yapmaya başlamak için ilk ürününü hemen ekle.</p>
        </div>
      )}

      <ProductDetailModal 
      product={selectedProduct} 
      onClose={() => setSelectedProduct(null)} />
    </main>
  );
}