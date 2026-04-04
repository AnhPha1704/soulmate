var express = require('express');
var router = express.Router();

const { protect } = require('../middleware/authMiddleware');

/* GET user profile. */
router.get('/profile', protect, function(req, res, next) {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

module.exports = router;
