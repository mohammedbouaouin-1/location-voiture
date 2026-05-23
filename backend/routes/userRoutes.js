const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.put('/profile', protect, updateProfile);

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
