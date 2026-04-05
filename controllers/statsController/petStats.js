const Pet = require('../../models/Pet');
const { getTargetUserId } = require('./utils');

// 3. Tìm Top 3 người dùng có Pet cấp độ cao nhất
exports.getLeaderboard = async (req, res) => {
    try {
        const result = await Pet.aggregate([
            { $match: { is_deleted: { $ne: true } } },
            { $sort: { level: -1, exp: -1 } },
            { $limit: 3 },
            { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "owner" } },
            { $unwind: "$owner" },
            { $project: { "owner.username": 1, name: 1, level: 1, exp: 1 } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 10. Xuất danh sách Pet không tương tác trong vòng 7 ngày qua
exports.getInactivePets = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await Pet.aggregate([
            { $match: { last_interaction: { $lt: sevenDaysAgo }, is_deleted: { $ne: true } } },
            { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "owner" } },
            { $unwind: "$owner" },
            { $project: { name: 1, level: 1, last_interaction: 1, "owner.username": 1, "owner.email": 1 } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
