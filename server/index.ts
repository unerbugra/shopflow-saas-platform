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
  id: number; 
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as TokenPayload;
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


app.get('/api/cart', authMiddleware, async (req: Request, res: Response) => {

  try {

    const customerId = (req as any).user.id;

    const result = await query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.customer_id = $1
      `,
      [customerId]
    );

    return res.status(200).json(result.rows);

  } catch (error) {

    console.error("Sepet getirme hatası:", error);

    return res.status(500).json({
      success: false,
      message: "Sepet yüklenirken bir hata oluştu."
    });

  }

});

app.post('/api/cart/items', authMiddleware, async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.id;
    const { product_id, quantity } = req.body;

    // 1. Gelen verileri doğrula
    if (
      !Number.isSafeInteger(product_id) ||
      product_id <= 0 ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz ürün ID'si veya miktar."
      });
    }

    const productResult = await query(
      'SELECT id, stock_quantity FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı."
      });
    }

    const stock = productResult.rows[0].stock_quantity;

    if (stock === 0) {
      return res.status(400).json({
        success: false,
        message: "Ürün stokta bulunmuyor."
      });
    }


const cartResult = await query(
  `
  INSERT INTO cart_items (customer_id, product_id, quantity)
  SELECT $1::integer, $2::integer, $3::integer
  WHERE $3::integer <= $4::integer

  ON CONFLICT (customer_id, product_id)
  DO UPDATE SET
    quantity = cart_items.quantity + EXCLUDED.quantity
  WHERE cart_items.quantity + EXCLUDED.quantity <= $4::integer

  RETURNING *;
  `,
  [customerId, product_id, quantity, stock]
);

// Başarısız işlem
if (cartResult.rows.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Sepete eklemek istediğiniz miktar mevcut stoğu aşıyor."
  });
}

// Başarılı işlem
return res.status(200).json({
  success: true,
  message: "Ürün sepete eklendi.",
  cartItem: cartResult.rows[0]
});


  } catch (error) {
    console.error("Sepete ekleme hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Ürün sepete eklenirken hata oluştu."
    });
  }
});
app.patch('/api/cart/items/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    // 1. Kullanıcı ID, ürün ID ve yeni miktarı al
    const customerId = (req as any).user.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    // 2. Gelen verileri doğrula
    if (
      !Number.isSafeInteger(productId) ||
      productId <= 0 ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz ürün ID'si veya miktar."
      });
    }

    // 3. Ürünün stok bilgisini getir
    const productResult = await query(
      'SELECT stock_quantity FROM products WHERE id = $1',
      [productId]
    );

    // 4. Ürün mevcut mu?
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı."
      });
    }

    // 5. Stok kontrolü
    const stock = productResult.rows[0].stock_quantity;

    if (quantity > stock) {
      return res.status(400).json({
        success: false,
        message: "İstenen miktar mevcut stoğu aşıyor."
      });
    }

    // 6. Sepetteki ürün miktarını güncelle
    const cartResult = await query(
      `
      UPDATE cart_items
      SET quantity = $1
      WHERE customer_id = $2
        AND product_id = $3
      RETURNING *;
      `,
      [quantity, customerId, productId]
    );

    // 7. Ürün kullanıcının sepetinde mevcut mu?
    if (cartResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ürün sepetinizde bulunamadı."
      });
    }

    // 8. Başarılı yanıt
    return res.status(200).json({
      success: true,
      message: "Sepetteki ürün miktarı güncellendi.",
      cartItem: cartResult.rows[0]
    });

  } catch (error) {
    console.error("Sepet miktarı güncelleme hatası:", error);

    return res.status(500).json({
      success: false,
      message: "Sepet miktarı güncellenirken hata oluştu."
    });
  }
});


app.post('/api/orders', authMiddleware, async (req: Request, res: Response) => {
  try {
    const customerId: number = (req as any).user.id; 
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

    const query1 = `
      INSERT INTO customers (first_name, last_name, email, password_hash, phone, address) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, email, role
    `;
    const result = await query(query1, [first_name, last_name, email, hashedPassword, phone, address]);
    const newUser = result.rows[0];

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role }, 
      JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    return res.status(201).json({ 
      success: true, 
      message: 'Kayıt başarıyla tamamlandı şef!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });

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
      { id: user.id, email: user.email, role: user.role }, 
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