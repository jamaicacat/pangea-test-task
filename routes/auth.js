const express = require('express')
const router = express.Router()

const {
	login,
	register,
	updateUser,
	deleteUser,
} = require('../controllers/authController')

const authenticateUser = require('../middleware/authentication')

router.post('/register', register)
router.post('/login', login)
router.get('/deleteAccount', authenticateUser, deleteUser)
router.post('/updateAccount', authenticateUser, updateUser)

module.exports = router
