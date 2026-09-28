import { useCart } from "../context/CartContext";


export default function Cart() {
  const { cart, removeFromCart, increaseQuantity } = useCart();


    const totalPrice = cart.reduce((acc, curr) => acc + (Number(curr.item.price) * curr.quantity), 0); 
    console.log("CART:", cart);
console.log("TOTAL PRICE:", totalPrice);


  
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-600">
            Shopflow Store
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">
            Sepetim
          </h1>

          <p className="mt-2 text-gray-500">
            Sepetindeki ürünleri kontrol et ve siparişini tamamla.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Products */}
          <div className="space-y-4">

            

            {cart.map(cartItem => {

                function handleDelete() {
                removeFromCart(cartItem.item.id);
            };

                function handleIncrease() {
                increaseQuantity(cartItem.item.id);
            }

            
              return (
                <div
                  key={cartItem.item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                    {/* Product Image Placeholder */}
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                      <span className="text-3xl">📦</span>
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {cartItem.item.name}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {cartItem.item.description}
                      </p>

                      <p className="mt-3 text-lg font-black text-purple-600">
                        ₺{cartItem.item.price}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-lg font-bold text-gray-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600">
                        −
                      </button>

                      <span className="w-8 text-center font-bold text-gray-900">
                        {cartItem.quantity}
                      </span>

                      <button onClick={handleIncrease} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-lg font-bold text-gray-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600">
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button onClick={handleDelete} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                      Sil
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">

            <h2 className="text-xl font-black text-gray-900">
              Sipariş Özeti
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between text-gray-500">
                <span>Ara toplam</span>
                <span className="font-semibold text-gray-900">
                    {totalPrice}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Kargo</span>
                <span className="font-semibold text-green-600">
                  Ücretsiz
                </span>
              </div>

            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex items-end justify-between">
              <span className="font-semibold text-gray-600">
                Toplam
              </span>

              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">
                  {totalPrice}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Vergiler dahil
                </p>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-200 transition-all duration-200 hover:bg-purple-700 hover:shadow-lg active:scale-[0.98]">
              Siparişi Tamamla
            </button>

            <button className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-purple-600">
              Alışverişe Devam Et
            </button>

          </aside>

        </div>
      </div>
    </div>
  );
}