import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}

export default function CustomerStorefront() {
  const [productList, setProductList] = useState<Product[]>([]);
  const { cart } = useCart();

  useEffect(() => {
    async function getProducts() {
      try {
        const result = await fetch("http://localhost:5001/api/products");
        const data = await result.json();

        setProductList(data);
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    }

    getProducts();
  }, []);

  const cartItemCount = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">

          <div className="flex items-start justify-between gap-6">

            {/* Header Text */}
            <div>
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

            {/* Cart */}
            <Link
              to="/cart"
              className="group relative flex shrink-0 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100"
            >
              {/* Cart Icon */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl transition-colors group-hover:bg-purple-100">
                🛒

                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-bold text-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </div>

              {/* Cart Text */}
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium text-gray-400">
                  Alışveriş
                </p>

                <p className="font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                  Sepetim
                </p>
              </div>

              {/* Arrow */}
              <span className="hidden text-lg text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-purple-500 sm:block">
                →
              </span>
            </Link>

          </div>

          {/* Products */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productList.map((product) => (
              <ProductCard
                key={product.id}
                item={product}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}