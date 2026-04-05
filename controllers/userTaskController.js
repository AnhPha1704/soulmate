const UserTask = require('../models/UserTask');
const Pet = require('../models/Pet');
const Task = require('../models/Task');

/**
 * Thuật toán tính Level với độ khó tăng dần (RPG Style)
 * Cấp 1 lên 2: cần 100 EXP
 * Cấp 2 lên 3: cần 200 EXP (Tổng 300)
 * Cấp 3 lên 4: cần 300 EXP (Tổng 600)
 */
const calculateLevel = (totalExp) => {
    let level = 1;
    let expAccumulated = 0;
    let expRequiredForNextLevel = 100; // Mốc điểm ban đầu

    while (totalExp >= expAccumulated + expRequiredForNextLevel) {
        expAccumulated += expRequiredForNextLevel;
        level++;
        // Độ khó tăng dần: Mỗi cấp đòi hỏi thêm 100 EXP so với cấp trước
        expRequiredForNextLevel = level * 100; 
    }
    return level;
};

/**
 * Cập nhật trạng thái nhiệm vụ & Hệ thống Gamification (Giai đoạn 2.2)
 */
const updateTaskStatus = async (req, res, next) => {
    try {
        const userTaskId = req.params.id;
        const newStatus = req.body.status;

        // 1. Tìm UserTask và chèn sẵn thông tin của Task gốc để lấy điểm thưởng
        const userTask = await UserTask.findById(userTaskId).populate('task_id');

        if (!userTask || userTask.is_deleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhiệm vụ' });
        }

        // 2. Chặn lỗi gian lận: Không cho phép nhận lại EXP trên nhiệm vụ đã hoàn thành
        if (userTask.status === 'done') {
            return res.status(400).json({ 
                success: false, 
                message: 'Nhiệm vụ này đã được hoàn thành từ trước, không thể nhận thêm EXP!' 
            });
        }

        let isLevelUp = false;
        let petUpdatedData = null;

        // 3. Nếu chuyển trạng thái thành HOÀN THÀNH (Done) -> Kích hoạt Gamification
        if (newStatus === 'done') {
            // Cập nhật trạng thái UserTask
            userTask.status = 'done';
            userTask.completed_at = Date.now();

            // Tính điểm
            const expReward = userTask.task_id.exp_reward || 10; // Điểm từ bài tập (mặc định 10)

            // Tìm Thú cưng tương ứng
            const pet = await Pet.findOne({ user_id: userTask.user_id, is_deleted: { $ne: true } });

            if (pet) {
                const oldLevel = pet.level;
                
                // Cộng dồn điểm
                pet.exp += expReward;
                
                // Cập nhật cấp độ bằng Thuật toán độ khó tăng dần
                pet.level = calculateLevel(pet.exp);
                
                // Gắn cờ nếu có nhảy cấp
                if (pet.level > oldLevel) {
                    isLevelUp = true;
                }

                await pet.save();
                petUpdatedData = pet;
            }
        } else {
            // Chỉ cập nhật trạng thái bình thường (pending <-> doing)
            userTask.status = newStatus;
        }

        // Lưu tiến trình
        const savedUserTask = await userTask.save();

        // 4. Phản hồi thông tin
        return res.status(200).json({
            success: true,
            userTask: savedUserTask,
            gamification: userTask.status === 'done' ? {
                exp_earned: userTask.task_id.exp_reward,
                pet_current_exp: petUpdatedData ? petUpdatedData.exp : 0,
                pet_current_level: petUpdatedData ? petUpdatedData.level : 1,
                is_level_up: isLevelUp,
                message: isLevelUp ? `🎉 Chúc mừng! Thú cưng của bạn đã thăng cấp lên Level ${petUpdatedData.level}!` 
                                  : 'Bạn vừa nhận được kinh nghiệm, hãy cố gắng tiếp tục!'
            } : null
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { updateTaskStatus, calculateLevel };
