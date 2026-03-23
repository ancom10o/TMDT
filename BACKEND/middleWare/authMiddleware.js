const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Cần đăng nhập để tiếp tục" });

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY'); 
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT Verify Error:", err.message);
        res.status(403).json({ message: "Phiên đăng nhập hết hạn hoặc Token không lệ" });
    }
};

module.exports = verifyToken;