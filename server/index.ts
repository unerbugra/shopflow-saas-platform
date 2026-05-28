import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
  console.error("KRİTİK HATA: JWT_SECRET .env dosyasında tanımlanmamış!");
  process.exit(1);
}

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

interface TokenPayload {
  userId: number; 
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    
    (req as any).user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

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

app.post('/api/products', async (req: Request, res: Response) => {
  const { name, description, price, stock_quantity } = req.body;

  try {
    const result = await query(
      'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock_quantity]
    );

    const product: Product = result.rows[0];
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Hata:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;
  const { name, description, price, stock_quantity } = req.body;

  try {
    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4 WHERE id = $5 RETURNING *',
      [name, description, price, stock_quantity, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
    }

    const updatedProduct: Product = result.rows[0];
    res.json(updatedProduct);

  } catch (error: any) {
    console.error("Hata:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
    }

    res.json({ success: true, message: "Ürün başarıyla silindi." });

  } catch (error: any) {
    console.error("Hata:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});


app.post('/api/orders', authMiddleware, async (req: Request, res: Response) => {
  try {
    const customerId: number = (req as any).user.userId; 
    const items: { product_id: number; quantity: number; unit_price: number }[] = req.body.items;

    const stockCheck: { stock_quantity: number }[] = await Promise.all(
      items.map(async (item) => {
        const result = await query('SELECT stock_quantity FROM products WHERE id = $1', [item.product_id]);
        if (result.rows.length === 0) {
          throw new Error(`Ürün ID ${item.product_id} bulunamadı.`);
        }
        return result.rows[0]; 
      })
    );

    for (let i = 0; i < items.length; i++) {
      if (stockCheck[i].stock_quantity < items[i].quantity) {
        return res.status(400).json({ success: false, message: `Ürün ID ${items[i].product_id} için yeterli stok yok.` });
      }
    }

    const totalAmount: number[] = items.map(item => item.quantity * item.unit_price);

    try {
      await query('BEGIN');
      
      const result = await query(
        'INSERT INTO orders (customer_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id', 
        [customerId, totalAmount.reduce((a, b) => a + b), 'pending']
      );
      const order_id = result.rows[0].id; 

      for (const item of items) {
        await query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', 
          [order_id, item.product_id, item.quantity, item.unit_price]
        );

        await query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2', 
          [item.quantity, item.product_id]
        );
      }
      
      await query('COMMIT');
      return res.status(201).json({ success: true, message: "Sipariş başarıyla oluşturuldu.", order_id }); 

    } catch (error: any) {
      await query('ROLLBACK');
      throw error; 
    }

  } catch (error: any) {
    console.error("Sipariş hatası:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Sunucu hatası." });
  }
}); 

app.post('/api/auth/register', async (req: Request, res: Response) => {  
  const { first_name, last_name, email, password, phone, address } = req.body;
  
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ success: false, message: "Lütfen gerekli alanları doldurun." });
  }

  try {
    const emailCheck = await query('SELECT EXISTS(SELECT 1 FROM customers WHERE email = $1)', [email]);

    if (emailCheck.rows[0].exists === true) {
      return res.status(400).json({ success: false, message: "Bu email zaten kullanılıyor." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query1 = 'INSERT INTO customers (first_name, last_name, email, password_hash, phone, address) VALUES ($1, $2, $3, $4, $5, $6)';
    await query(query1, [first_name, last_name, email, hashedPassword, phone, address]);

    return res.status(201).json({ success: true, message: 'User registered successfully!' });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Lütfen email ve şifre girin." });
  }

  try {
    const userCheck = await query('SELECT * FROM customers WHERE email = $1', [email]);

    if (userCheck.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = userCheck.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, 
      JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful!', 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



app.get('/api/auth/verify', authMiddleware, (req: any, res: any) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user 
    });
  } catch (error) {
    console.error('Verify endpoint hatası şef:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda TS ile canavar gibi çalışıyor...`);
});