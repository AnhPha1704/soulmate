const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Get token from cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get User from Database
        const user = await User.findById(decoded.id);

        if (!user || user.is_deleted) {
            return res.status(401).json({
                success: false,
                message: 'No user found with this id'
            });
        }

        // 5. Grant access
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

module.exports = { protect };
