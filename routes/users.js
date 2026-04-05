const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', function(req, res, next) {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

router.route('/')
    .get(genericController.getAll(User))
    .post(genericController.create(User));

router.route('/:id')
    .get(genericController.get(User))
    .patch(genericController.update(User))
    .delete(genericController.delet(User));

module.exports = router;
