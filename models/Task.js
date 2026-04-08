const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a task title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    mood_target: {
        type: String,
        required: [true, 'Please provide a mood target for this task'],
        enum: ['Vui', 'Buồn', 'Căng thẳng', 'Bình thản', 'Mệt mỏi', 'Hào hứng', 'Lo âu', 'General']
    },
    exp_reward: {
        type: Number,
        default: 10
    },
    category: {
        type: String,
        enum: ['Meditation', 'Exercise', 'Social', 'Journaling', 'Art', 'Nature', 'Other'],
        default: 'Other'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    is_ai_generated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Text index for search on title and description
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
