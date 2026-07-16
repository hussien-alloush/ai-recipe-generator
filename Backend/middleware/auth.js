import jwt from 'jsonwebtoken';

const authMiddleware = async(req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email        
        };
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default authMiddleware;