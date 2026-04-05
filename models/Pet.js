const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a pet name'],
        trim: true
    },
    level: {
        type: Number,
        default: 1
    },
    exp: {
        type: Number,
        default: 0
    },
    mood_state: {
        type: String,
        default: 'Happy'
    },
    last_interaction: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
