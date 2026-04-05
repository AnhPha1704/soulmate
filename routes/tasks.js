const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Thêm phân quyền admin nếu cần

router.route('/')
    .get(genericController.getAll(Task))
    .post(genericController.create(Task));

router.get('/search', genericController.search(Task));

router.route('/:id')
    .get(genericController.get(Task))
    .patch(genericController.update(Task))
    .delete(genericController.delet(Task));

module.exports = router;
