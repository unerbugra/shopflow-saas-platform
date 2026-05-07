import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

interface Product {
  id: number;
  name: string;
  description: string;
  price: string; 
  stock_quantity: number;
  created_at: string;
}

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM products');
    const products: Product[] = result.rows;
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
    }

    const product: Product = result.rows[0];
    res.json(product);

  } catch (error: any) {
    console.error("Hata:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda TS ile canavar gibi çalışıyor...`);
});