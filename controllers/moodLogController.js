const MoodLog = require('../models/MoodLog');
const Task = require('../models/Task');
const UserTask = require('../models/UserTask');
const aiService = require('../services/aiService'); // Mới: Gọi AI Service

/**
 * Tạo bản ghi tâm trạng mới và Gợi ý nhiệm vụ thông minh (Hybrid AI System - Giai đoạn 2.1)
 */
const createMoodLog = async (req, res, next) => {
    try {
        const { mood_type, journal_content } = req.body;

        // 1. Lưu bản ghi nhật ký (MoodLog)
        const moodLog = new MoodLog({
            ...req.body,
            user_id: req.user._id
        });
        const savedLog = await moodLog.save();

        let recommendedTask = null;
        let createdUserTask = null;

        // 2. ƯU TIÊN 1: THỬ GỢI Ý BẰNG AI (Nếu có nội dung tâm sự)
        if (journal_content && journal_content.trim().length >= 5) {
            console.log('--- Đang gọi AI để phân tích và sinh Task cá nhân hóa ---');
            const aiTaskData = await aiService.generateTaskFromMood(mood_type, journal_content);
            
            if (aiTaskData) {
                // Lưu Task do AI sinh vào Database để quản lý (is_ai_generated: true)
                const newTask = new Task({
                    ...aiTaskData,
                    mood_target: mood_type,
                    is_ai_generated: true
                });
                recommendedTask = await newTask.save();
                console.log('✅ AI đã sinh Task thành công!');
            }
        }

        // 3. ƯU TIÊN 2 (FALLBACK): LẤY TASK CÓ SẴN TỪ KHO (Nếu AI lỗi hoặc ko có nội dung)
        if (!recommendedTask) {
            console.log('--- Chế độ Fallback: Đang lấy Task thủ công từ kho ---');
            // Tìm các Task khớp với mood
            let suitableTasks = await Task.find({ mood_target: mood_type, is_deleted: { $ne: true } });

            // Nếu ko có task khớp mood, lấy task General
            if (suitableTasks.length === 0) {
                suitableTasks = await Task.find({ mood_target: 'General', is_deleted: { $ne: true } });
            }

            if (suitableTasks.length > 0) {
                const randomIndex = Math.floor(Math.random() * suitableTasks.length);
                recommendedTask = suitableTasks[randomIndex];
            }
        }

        // 4. GIAO NHIỆM VỤ CHO USER (UserTask)
        if (recommendedTask) {
            const userTask = new UserTask({
                user_id: req.user._id,
                task_id: recommendedTask._id,
                status: 'pending',
                assigned_at: Date.now()
            });
            createdUserTask = await userTask.save();
        }

        // 5. Phản hồi kết quả
        return res.status(201).json({
            success: true,
            moodLog: savedLog,
            recommendedTask: recommendedTask ? {
                task_info: recommendedTask,
                progress_id: createdUserTask._id,
                source: recommendedTask.is_ai_generated ? 'AI Personalization' : 'Master Task Pool'
            } : null,
            message: recommendedTask 
                ? 'Đã lưu nhật ký và gợi ý nhiệm vụ phù hợp!' 
                : 'Đã lưu nhật ký thành công (Chưa có nhiệm vụ phù hợp).'
        });

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { createMoodLog };
