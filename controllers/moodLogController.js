const MoodLog = require('../models/MoodLog');
const Task = require('../models/Task');
const UserTask = require('../models/UserTask');

/**
 * Tạo bản ghi tâm trạng mới và Tự động giao nhiệm vụ (Giai đoạn 2.1)
 */
const createMoodLog = async (req, res, next) => {
    try {
        // 1. Tạo bản ghi nhật ký (MoodLog) nháp
        const moodLog = new MoodLog({
            ...req.body,
            user_id: req.user._id // Gắn chặt log với người dùng đang đăng nhập (bảo mật)
        });

        // 2. Lưu xuống Database
        const savedLog = await moodLog.save();

        // 3. Logic Gợi ý nhiệm vụ (Recommend Task)
        const currentMood = savedLog.mood_type;

        // Tìm tất cả các Task khớp với tâm trạng hiện tại
        let suitableTasks = await Task.find({ mood_target: currentMood, is_deleted: { $ne: true } });

        // TÍNH NĂNG DỰ PHÒNG: Nếu chưa có Task nào khớp mood, tìm Task "General"
        if (suitableTasks.length === 0) {
            suitableTasks = await Task.find({ mood_target: 'General', is_deleted: { $ne: true } });
        }

        let recommendedTask = null;
        let createdUserTask = null;

        if (suitableTasks.length > 0) {
            // Random chọn 1 Task phân công để khỏi nhàm chán
            const randomIndex = Math.floor(Math.random() * suitableTasks.length);
            recommendedTask = suitableTasks[randomIndex];

            // 4. Tạo tiến độ nhiệm vụ cho User
            const userTask = new UserTask({
                user_id: req.user._id,
                task_id: recommendedTask._id,
                status: 'pending',
                assigned_at: Date.now()
            });

            createdUserTask = await userTask.save();
        }

        // 5. Trả về kết quả hoàn chỉnh
        return res.status(201).json({
            success: true,
            moodLog: savedLog,
            recommendedTask: recommendedTask ? {
                task_info: recommendedTask,
                progress_id: createdUserTask._id // ID để sau này dùng PATCH báo cáo hoàn thành
            } : null,
            message: recommendedTask 
                ? 'Đã lưu nhật ký và giao nhiệm vụ mới dựa theo tâm trạng!' 
                : 'Đã lưu nhật ký (Chưa có bài tập phù hợp trong hệ thống để giao)'
        });

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { createMoodLog };
