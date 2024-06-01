const jwt = require('jsonwebtoken')

const { UnauthenticatedError } = require('../errors/index')

const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith('Bearer')) {
		throw new UnauthenticatedError('Authentication invalid')
	}

	const token = authHeader.split(' ')[1]
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)

		req.user = { userId: payload.userId, name: payload.name }
		next()
	} catch (error) {
		console.error('error', error)
		if (error.message === 'jwt expired') {
			res.setHeader('Authorization', '')
			throw new UnauthenticatedError('Session expired. Login again, please')
		} else {
			throw new UnauthenticatedError('Authentication invalid')
		}
	}
}

module.exports = auth
