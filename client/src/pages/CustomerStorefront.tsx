import { useState, useEffect} from 'react';


interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
}

export default function CustomerStorefront(){

      const [productList, setProductList] = useState<Product[]>([]);
    
    
    useEffect(() => {
        fetch('http://localhost:5001/api/products')
          .then(res => res.json())
          .then(data => {
            setProductList(Array.isArray(data) ? data : []);
          })
          .catch(err => console.error('Hata:', err));
      }, []);

      

    return (
  <div className="min-h-screen bg-white px-8 py-10">
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-600">
          Shopflow Store
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-black">
          Keşfet, beğen, satın al.
        </h1>

        <p className="mt-3 max-w-2xl text-gray-500">
          Shopflow'a hoş geldiniz. Güncel ürünleri inceleyin ve size uygun olanı keşfedin.
        </p>
      </div>

      {productList.length === 0 ? (
        <div className="rounded-3xl border border-purple-100 bg-purple-50 p-10 text-center">
          <h2 className="text-xl font-bold text-black">
            Henüz ürün bulunmuyor
          </h2>
          <p className="mt-2 text-gray-500">
            Yeni ürünler eklendiğinde burada görüntülenecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {productList.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-black text-4xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                  🛍️
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-black">
                    {product.name}
                  </h2>

                  <span className="whitespace-nowrap rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    Stok: {product.stock_quantity}
                  </span>
                </div>

                <p className="min-h-[48px] text-sm leading-6 text-gray-500">
                  {product.description || 'Bu ürün için henüz açıklama bulunmuyor.'}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Fiyat
                    </p>

                    <p className="mt-1 text-2xl font-black text-purple-700">
                      ₺{product.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 active:scale-95"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}