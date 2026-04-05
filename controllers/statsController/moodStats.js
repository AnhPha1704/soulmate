const MoodLog = require('../../models/MoodLog');
const { getTargetUserId } = require('./utils');

// 2. Thống kê số lần từng loại tâm trạng xuất hiện
exports.getMoodCount = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await MoodLog.aggregate([
            { $match: { user_id: targetUserId } },
            { $group: { _id: "$mood_type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Thống kê tâm trạng phổ biến nhất theo từng tháng
exports.getMoodSummaryByMonth = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await MoodLog.aggregate([
            { $match: { user_id: targetUserId } },
            { $group: { 
                _id: { month: { $month: "$created_at" }, mood: "$mood_type" }, 
                count: { $sum: 1 } 
            }},
            { $sort: { "_id.month": 1, count: -1 } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 6. Hiển thị nhật ký kèm tên người dùng và tên Pet
exports.getLogsWithUserAndPet = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const result = await MoodLog.aggregate([
            { $match: { is_deleted: { $ne: true } } }, 
            { $sort: { created_at: -1 } },
            { $limit: limit }, 
            { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "u" } },
            { $lookup: { from: "pets", localField: "user_id", foreignField: "user_id", as: "p" } },
            { $unwind: "$u" }, 
            { $unwind: { path: "$p", preserveNullAndEmptyArrays: true } }, 
            { $project: { _id: 1, journal_content: 1, mood_type: 1, created_at: 1, "u.username": 1, "p.name": 1 } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
