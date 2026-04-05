const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const UserTask = require('../models/UserTask');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(genericController.getAll(UserTask, { path: 'task_id', select: 'title category exp_reward' }))
    .post(genericController.create(UserTask));

router.route('/:id')
    .get(genericController.get(UserTask, { path: 'task_id', select: 'title category exp_reward' }))
    .patch(genericController.update(UserTask))
    .delete(genericController.delet(UserTask));

module.exports = router;
