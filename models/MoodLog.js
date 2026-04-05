const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood_type: {
        type: String,
        required: [true, 'Please provide a mood type'],
        enum: ['Vui', 'Buồn', 'Căng thẳng', 'Bình thản', 'Mệt mỏi', 'Hào hứng', 'Lo âu']
    },
    journal_content: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for full-text search on journal_content
moodLogSchema.index({ journal_content: 'text' });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
module.exports = MoodLog;
