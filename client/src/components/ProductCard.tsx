import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}

interface ProductCardProps {
  item: Product; 
}

export default function ProductCard({item}:ProductCardProps){

  const [quantity, setQuantity] = useState(1);
 
  function minQuantity(){

    if(quantity<2){

      return;
    }

    else{

      setQuantity(quantity - 1)
    }

  }
  
  function maxQuantity(){

    if(quantity===item.stock_quantity){


      return;

      
    }

    else{

        setQuantity(quantity + 1);

      }
  }

    if (item.stock_quantity === 0) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 opacity-60 shadow-sm">

      <div className="absolute left-0 top-0 h-1.5 w-full bg-gray-300"></div>

      <div className="mb-6 flex h-44 items-center justify-center rounded-2xl bg-gray-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-200 text-4xl grayscale">
          📦
        </div>
      </div>

      <div className="space-y-3">

        <div className="flex items-start justify-between gap-4">

          <h1 className="text-xl font-bold leading-tight text-gray-500">
            {item.name}
          </h1>

          <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
            Stok Tükendi
          </span>

        </div>

        <p className="min-h-[48px] text-sm leading-6 text-gray-400">
          {item.description}
        </p>

        <div className="pt-2">

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Fiyat
          </p>

          <p className="mt-1 text-3xl font-black tracking-tight text-gray-400">
            ₺{item.price}
          </p>

        </div>

      </div>

      <div className="mt-6 border-t border-gray-200 pt-5">

        <button
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3 text-sm font-bold text-gray-500"
        >
          Stokta Yok
        </button>

      </div>

    </div>
  );
}
  
    return(

      <div className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/70">

        {/* Üst dekoratif mor alan */}
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400"></div>

        {/* Ürün ikonu / görsel alanı */}
        <div className="mb-6 flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 text-4xl shadow-inner transition-transform duration-300 group-hover:scale-105">
            📦
          </div>
        </div>

        {/* Ürün bilgileri */}
        <div className="space-y-3">

          <div className="flex items-start justify-between gap-4">

            <h1 className="text-xl font-bold leading-tight text-gray-900">
              {item.name}
            </h1>

            <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Stok: {item.stock_quantity}
            </span>

          </div>

          <p className="min-h-[48px] text-sm leading-6 text-gray-500">
            {item.description}
          </p>

          <div className="pt-2">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Fiyat
            </p>

            <p className="mt-1 text-3xl font-black tracking-tight text-purple-700">
              ₺{item.price}
            </p>

          </div>

        </div>

        {/* Alt bölüm */}
        <div className="mt-6 border-t border-purple-100 pt-5">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Adet
              </p>

              <div className="flex items-center overflow-hidden rounded-xl border border-purple-200 bg-purple-50">

                <button
                  onClick={minQuantity}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-purple-700 transition hover:bg-purple-100 active:scale-95"
                >
                  -
                </button>

                <p className="flex h-10 min-w-12 items-center justify-center border-x border-purple-200 bg-white px-3 text-sm font-bold text-gray-900">
                  {quantity}
                </p>

                <button
                  onClick={maxQuantity}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-purple-700 transition hover:bg-purple-100 active:scale-95"
                >
                  +
                </button>

              </div>

            </div>

            <button className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95">
              Sepete Ekle
            </button>

          </div>

        </div>

      </div>

      
    )
};