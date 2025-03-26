import jwt from 'jsonwebtoken';
import Users from "../models/Users.js"


export const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies.session_token; 
    
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    const user = await Users.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};