const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'doing', 'done'],
        default: 'pending'
    },
    assigned_at: {
        type: Date,
        default: Date.now
    },
    completed_at: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UserTask = mongoose.model('UserTask', userTaskSchema);
module.exports = UserTask;
