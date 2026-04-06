require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Pet = require('./models/Pet');
const Task = require('./models/Task');
const MoodLog = require('./models/MoodLog');
const UserTask = require('./models/UserTask');

const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        console.log('⏳ Đang xóa dữ liệu cũ...');
        
        await User.deleteMany();
        await Pet.deleteMany();
        await Task.deleteMany();
        await MoodLog.deleteMany();
        await UserTask.deleteMany();

        console.log('✅ Xóa dữ liệu cũ thành công!');
        console.log('⏳ Đang khởi tạo dữ liệu mới...');

        // 1. TẠO TASKS
        const tasksArr = [
            { title: 'Thiền định 10 phút', description: 'Nhắm mắt và tập trung vào hơi thở', mood_target: 'Căng thẳng', exp_reward: 20, category: 'Meditation', priority: 'high' },
            { title: 'Nghe nhạc sóng não', description: 'Nghe nhạc thư giãn Alpha', mood_target: 'Mệt mỏi', exp_reward: 10, category: 'Art', priority: 'medium' },
            { title: 'Chạy bộ 3km', description: 'Vận động thể chất', mood_target: 'Bình thản', exp_reward: 50, category: 'Exercise', priority: 'high' },
            { title: 'Chia sẻ niềm vui', description: 'Nhắn cho người thân 1 lời chúc', mood_target: 'Vui', exp_reward: 15, category: 'Social', priority: 'low' },
            { title: 'Viết tự do', description: 'Thả trôi cảm xúc ra giấy', mood_target: 'Buồn', exp_reward: 25, category: 'Journaling', priority: 'medium' },
            { title: 'Đọc 10 trang sách', description: 'Sách self-help', mood_target: 'General', exp_reward: 20, category: 'Other', priority: 'medium' }
        ];
        const createdTasks = await Task.insertMany(tasksArr);

        // 2. TẠO USERS
        const password_hash = await bcrypt.hash('123456', 10);
        const usersArr = [
            { username: 'testuser1', email: 'user1@test.com', password_hash },
            { username: 'testuser2', email: 'user2@test.com', password_hash },
            { username: 'testuser3', email: 'user3@test.com', password_hash }
        ];
        const createdUsers = await User.insertMany(usersArr);

        // 3. TẠO PETS
        const petsArr = createdUsers.map((u, i) => ({
            user_id: u._id,
            name: `Bebe ${i + 1}`,
            level: i * 2 + 1, // Pet lv 1, 3, 5
            exp: i * 300 + 50,
            mood_state: 'Vui',
            last_interaction: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000) // Pet 2,3 ko tương tác vài ngày
        }));
        await Pet.insertMany(petsArr);

        // 4. TẠO MOOD LOGS
        let moodLogsArr = [];
        const moods = ['Vui', 'Buồn', 'Căng thẳng', 'Bình thản', 'Mệt mỏi'];
        
        createdUsers.forEach(u => {
            for(let i=0; i<15; i++) { // Mỗi user 15 log chia đều 1 tháng qua
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                const pastDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
                
                moodLogsArr.push({
                    user_id: u._id,
                    mood_type: randomMood,
                    journal_content: `Hôm nay mình cảm thấy ${randomMood}. Chuyện là...`,
                    tags: ['nhật ký', 'thử nghiệm', randomMood],
                    created_at: pastDate
                });
            }
        });
        await MoodLog.insertMany(moodLogsArr);

        // 5. TẠO USER TASKS (Bao gồm các log quá hạn 24h)
        let userTasksArr = [];
        createdUsers.forEach(u => {
            createdTasks.forEach((t, i) => {
                // Tạo 1 task doing, 1 task pending, và nhiều task done với ngày hoàn thành khác nhau
                const status = i === 0 ? 'doing' : (i === 1 ? 'pending' : 'done');
                const pastDate = new Date(Date.now() - (i + 2) * 24 * 60 * 60 * 1000); // Assigned days ago
                const completedDate = status === 'done' ? new Date(pastDate.getTime() + (i * 12 + 5) * 60 * 60 * 1000) : null; 
                // Có task hoàn thành sau 5h, có task > 24h

                userTasksArr.push({
                    user_id: u._id,
                    task_id: t._id,
                    status: status,
                    assigned_at: pastDate,
                    completed_at: completedDate
                });
            });
        });
        await UserTask.insertMany(userTasksArr);

        console.log(`✅ Đã thêm: ${createdUsers.length} Users, ${petsArr.length} Pets, ${createdTasks.length} Tasks, ${moodLogsArr.length} MoodLogs, ${userTasksArr.length} UserTasks`);
        console.log('🎉 Seed dữ liệu Hoàn tất! Nhấn Ctrl + C để thoát.');
        process.exit();

    } catch (err) {
        console.error('Lỗi seed data:', err);
        process.exit(1);
    }
};

seedData();
