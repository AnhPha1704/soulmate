const UserTask = require('../../models/UserTask');
const { getTargetUserId } = require('./utils');

// 1. Tính tổng EXP người dùng A tích lũy cho Pet
exports.getTotalExp = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await UserTask.aggregate([
            { $match: { user_id: targetUserId, status: "done" } },
            { $lookup: { from: "tasks", localField: "task_id", foreignField: "_id", as: "t" } },
            { $unwind: "$t" },
            { $group: { _id: "$user_id", total_exp: { $sum: "$t.exp_reward" } } }
        ]);
        
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Tính tỷ lệ (%) hoàn thành nhiệm vụ
exports.getTaskCompletionRatio = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await UserTask.aggregate([
            { $match: { user_id: targetUserId, is_deleted: { $ne: true } } },
            { $group: {
                _id: "$user_id",
                done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
                total: { $sum: 1 }
            }},
            { $project: { 
                done: 1, 
                total: 1, 
                ratio: { 
                    $cond: [ { $eq: ["$total", 0] }, 0, { $multiply: [{ $divide: ["$done", "$total"] }, 100] } ]
                } 
            }}
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 7. Tính thời gian trung bình (phút) hoàn thành một nhiệm vụ
exports.getAvgTaskCompletionTime = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await UserTask.aggregate([
            { $match: { user_id: targetUserId, status: "done", completed_at: { $ne: null } } },
            { $project: { duration: { $subtract: ["$completed_at", "$assigned_at"] } } },
            { $group: { _id: null, avg_min: { $avg: { $divide: ["$duration", 60000] } } } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
