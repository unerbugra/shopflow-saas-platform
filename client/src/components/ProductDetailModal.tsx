import Modal from 'react-modal';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
}



export default function ProductDetailModal(props: { product: Product | null; onClose: () => void }) {
        

            return(
           <Modal 
  isOpen={props.product !== null} 
  onRequestClose={() => props.onClose()} 
  contentLabel="Product Details"
  // Modalın kendi kutusu (Beyaz, yuvarlatılmış köşeler, gölge ve animasyon uyumlu)
  className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 outline-none max-h-[90vh] overflow-y-auto transform transition-all m-4"
  // Ekranı kaplayan koyu ve blurlu arka plan
  overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
  {props.product && (
    <div className="flex flex-col h-full">
      {/* Üst Başlık Alanı ve Kapatma Çarpısı */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#ff6000] bg-orange-50 px-3 py-1 rounded-full">
            Ürün Detay Kartı
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {props.product.name}
          </h2>
        </div>
        <button 
          onClick={() => props.onClose()}
          className="text-gray-400 hover:text-gray-600 text-xl font-semibold p-1.5 hover:bg-gray-50 rounded-xl transition-all"
        >
          ✕
        </button>
      </div>

      {/* Detay Bilgileri İçerik Alanı */}
      <div className="space-y-5 flex-grow">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Açıklama</h4>
          <p className="text-gray-600 mt-1.5 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
            {props.product.description || 'Bu ürün için bir açıklama belirtilmemiş.'}
          </p>
        </div>

        {/* Fiyat ve Stok İkili Grid Alanı */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50/50 to-orange-50 p-4 rounded-xl border border-orange-100/50">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wide">Birim Fiyat</h4>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {props.product.price} <span className="text-sm font-bold text-gray-500">TL</span>
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Stok Durumu</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold text-gray-800">
                {props.product.stock_quantity} <span className="text-sm font-medium text-gray-500">Adet</span>
              </p>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                Number(props.product.stock_quantity) > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {Number(props.product.stock_quantity) > 0 ? 'Mevcut' : 'Tükendi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Kapatma Butonu */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <button 
          onClick={() => props.onClose()}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-gray-200 active:scale-[0.99]"
        >
          Pencereyi Kapat
        </button>
      </div>
    </div>
  )}
</Modal>
            )
        }
