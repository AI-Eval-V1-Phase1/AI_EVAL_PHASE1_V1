import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: "Token missing" });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Token invalid or expired" });
        if (decoded !== undefined)
            req.user = decoded;
        next();
    });
};
export default authenticateToken;
