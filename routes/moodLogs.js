const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const MoodLog = require('../models/MoodLog');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(genericController.getAll(MoodLog))
    .post(genericController.create(MoodLog));

router.route('/:id')
    .get(genericController.get(MoodLog))
    .patch(genericController.update(MoodLog))
    .delete(genericController.delet(MoodLog));

module.exports = router;
