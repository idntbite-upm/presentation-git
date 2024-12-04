const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { auth} = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);


// router.get('/admin', adminAuth, (req, res) => {
//     res.send('Admin access granted');
// });

module.exports = router;                