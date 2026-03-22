const express = require('express');
const { getUsers, getUser} = require('../controllers/user');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUser);

module.exports = router;