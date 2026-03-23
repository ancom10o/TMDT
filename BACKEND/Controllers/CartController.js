const db = require('../db');

const cartController = {
  // 1. Lấy giỏ hàng
  getCart: async (req, res) => {
    const userId = req.user.id;
    try {
      const cart = await db.query(
        `SELECT ci.*, p.name, p.price, p.image_url, p.stock 
         FROM cart_items ci 
         JOIN products p ON ci.product_id = p.id 
         JOIN carts c ON ci.cart_id = c.id 
         WHERE c.user_id = $1`, [userId]
      );
      res.json(cart.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 2. Thêm vào giỏ hàng
  addToCart: async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    try {
      let cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cart.rows.length === 0) {
        cart = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      }
      const cartId = cart.rows[0].id;

      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (cart_id, product_id) 
         DO UPDATE SET quantity = cart_items.quantity + $3`,
        [cartId, productId, quantity]
      );
      res.json({ message: "Đã thêm vào giỏ hàng" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 3. Cập nhật số lượng (dùng cho nút +/- trong Cart page)
  updateQuantity: async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    try {
      await db.query(
        `UPDATE cart_items SET quantity = $1 
         WHERE product_id = $2 AND cart_id = (SELECT id FROM carts WHERE user_id = $3)`,
        [quantity, productId, userId]
      );
      res.json({ message: "Cập nhật số lượng thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 4. Xóa 1 sản phẩm
  removeItem: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
      await db.query(
        `DELETE FROM cart_items 
         WHERE product_id = $1 AND cart_id = (SELECT id FROM carts WHERE user_id = $2)`,
        [productId, userId]
      );
      res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 5. MERGE CART: Đồng bộ LocalStorage lên DB khi đăng nhập
  mergeCart: async (req, res) => {
    const { items } = req.body; // Mảng các item từ localStorage
    const userId = req.user.id;
    try {
      let cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cart.rows.length === 0) {
        cart = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      }
      const cartId = cart.rows[0].id;

      // Duyệt qua từng sản phẩm từ local gửi lên và upsert vào DB
      for (const item of items) {
        await db.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (cart_id, product_id) 
           DO UPDATE SET quantity = cart_items.quantity + $3`,
          [cartId, item.id, item.quantity]
        );
      }
      res.json({ message: "Đồng bộ giỏ hàng thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = cartController;