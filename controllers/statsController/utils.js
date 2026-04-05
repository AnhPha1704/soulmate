const mongoose = require('mongoose');

// Helper to get user_id from query or fallback to logged-in user
exports.getTargetUserId = (req) => {
    return req.query.user_id ? new mongoose.Types.ObjectId(req.query.user_id) : req.user._id;
};
