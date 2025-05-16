import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Auth error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired', code: 'TOKEN_EXPIRED' });
        }

        return res.status(401).json({ message: 'Invalid token', code: 'TOKEN_INVALID' });
    }
};