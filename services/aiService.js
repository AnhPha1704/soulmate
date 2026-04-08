const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service for SoulMate
 * Integrates with Google Gemini to generate personalized mental health tasks.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Dựa trên tâm trạng và nội dung nhật ký, AI sẽ gợi ý một nhiệm vụ cụ thể.
 * @param {string} mood - Tâm trạng chính (Vui, Buồn, Stress, ...)
 * @param {string} journalContent - Nội dung chi tiết nhật ký
 * @returns {Object|null} - Đối tượng Task {title, description, category, exp_reward} hoặc null
 */
exports.generateTaskFromMood = async (mood, journalContent) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            console.warn('AI Service: GEMINI_API_KEY is not configured.');
            return null;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Bạn là một chuyên gia tâm lý và trợ lý sức khỏe tinh thần cho ứng dụng "SoulMate".
            Người dùng vừa viết một nhật ký tâm trạng như sau:
            - Tâm trạng: ${mood}
            - Nội dung nhật ký: "${journalContent}"

            Dựa trên thông tin này, hãy đề xuất 01 nhiệm vụ cụ thể, thiết thực và ngắn gọn để giúp họ (nếu họ buồn/stress thì giúp họ thoải mái hơn, nếu họ vui thì giúp họ lưu giữ khoảnh khắc).
            
            Yêu cầu quan trọng:
            1. Kết quả CHỈ được trả về định dạng JSON nguyên bản, không bao gồm markdown hay văn bản giải thích.
            2. Cấu trúc JSON phải chính xác như sau:
            {
                "title": "Tên nhiệm vụ (ngắn gọn, dưới 10 từ)",
                "description": "Mô tả chi tiết cách thực hiện (dưới 30 từ)",
                "category": "Chọn 1 trong các loại: 'Meditation', 'Exercise', 'Social', 'Journaling', 'Art', 'Nature', 'Other'",
                "exp_reward": 20 (số điểm kinh nghiệm từ 10-50 tùy độ khó)
            }
            3. Ngôn ngữ: Tiếng Việt.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('--- AI Response Raw ---');
        console.log(text);

        // Regex mạnh mẽ hơn để trích xuất khối JSON nằm giữa dấu ngoặc nhọn
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('AI Service: Không tìm thấy khối JSON trong phản hồi.');
            return null;
        }

        const taskData = JSON.parse(jsonMatch[0]);
        
        // Kiểm tra tính hợp lệ của enum category trước khi trả về
        const validCategories = ['Meditation', 'Exercise', 'Social', 'Journaling', 'Art', 'Nature', 'Other'];
        if (!validCategories.includes(taskData.category)) {
            taskData.category = 'Other';
        }

        return taskData;

    } catch (error) {
        console.error('AI Service Error:', error.message);
        return null; // Fallback to manual tasks logic in controller
    }
};
