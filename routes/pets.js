const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const Pet = require('../models/Pet');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(genericController.getAll(Pet))
    .post(genericController.create(Pet));

router.route('/:id')
    .get(genericController.get(Pet, { path: 'user_id', select: 'username email' }))
    .patch(genericController.update(Pet))
    .delete(genericController.delet(Pet));

module.exports = router;
