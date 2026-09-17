import { useState, useEffect} from 'react';
import ProductCard from '../components/ProductCard';


interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}


export default function CustomerStorefront(){

  const [productList, setProductList] = useState<Product[]>([]);

    useEffect(() => {

    async function getProducts(){

     try{

      const result = await fetch("http://localhost:5001/api/products");
      const data  = await result.json();
      setProductList(data);


     }  

     catch(error){

      console.error("Bir hata oluştu:", error);
     }

    }
    
        getProducts(); 


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
          
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {productList.map((product)=>
          
                    <ProductCard key={product.id} item={product} />

        )
        }

        </div>
          
      </div>
    </div>
  </div>
)}