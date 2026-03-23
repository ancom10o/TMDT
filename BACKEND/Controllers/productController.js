const pool = require("../db");

exports.getProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, ARRAY_AGG(pi.image_url) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.date_added DESC
    `;
    
    const result = await pool.query(query);

    const formattedProducts = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      old_price: product.old_price, 
      description: product.description,
      gender: product.gender,
      recipient: product.recipient,
      date_added: product.date_added,
      sold: product.sold,
      stock: product.stock,
      // Xử lý mảng ảnh để không bị null
      images: (product.images && product.images[0] !== null) ? product.images : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Lỗi Controller:", error.message);
    res.status(500).json({ message: "Lỗi Server khi lấy sản phẩm" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, ARRAY_AGG(pi.image_url) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const item = result.rows[0];
    res.json({
      ...item,
      images: (item.images && item.images[0] !== null) ? item.images : []
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};