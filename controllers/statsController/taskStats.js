const UserTask = require('../../models/UserTask');
const Task = require('../../models/Task');
const { getTargetUserId } = require('./utils');

// 8. Tìm các nhiệm vụ hoàn thành sau 24 giờ kể từ khi được giao
exports.getLateCompletedTasks = async (req, res) => {
    try {
        const targetUserId = getTargetUserId(req);
        const result = await UserTask.aggregate([
            { $match: { user_id: targetUserId, status: "done", completed_at: { $ne: null } } },
            { $project: { 
                task_id: 1, 
                assigned_at: 1, 
                completed_at: 1, 
                time: { $subtract: ["$completed_at", "$assigned_at"] } 
            }},
            { $match: { time: { $gt: 86400000 } } }, // 24 hours in ms
            { $lookup: { from: "tasks", localField: "task_id", foreignField: "_id", as: "task" } },
            { $unwind: "$task" }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 9. Lọc nhiệm vụ thuộc category "Meditation" (Thiền định) và priority "high"
exports.getSpecificTasks = async (req, res) => {
    try {
        const result = await Task.aggregate([
            { $match: { category: "Meditation", priority: "high", is_deleted: { $ne: true } } }
        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
