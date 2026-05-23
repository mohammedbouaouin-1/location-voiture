const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const { registerValidationRules, loginValidationRules, validate } = require('../middlewares/validationMiddleware');

router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);
router.get('/me', protect, getMe);

module.exports = router;
