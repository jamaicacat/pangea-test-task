const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/index')

const User = require('../models/User')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })

	res
		.status(StatusCodes.CREATED)
		.json({ user: { name: user.name }, token: user.createJWT() })
}

const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new BadRequestError('Provide login credentials')
	}

	const user = await User.findOne({ email })

	if (!user) {
		throw new UnauthenticatedError('Invalid credentials')
	}

	const isPasswordCorrect = await user.comparePassword(password)

	if (isPasswordCorrect) {
		res
			.status(StatusCodes.OK)
			.json({ user: { name: user.name }, token: user.createJWT() })
	} else throw new UnauthenticatedError('Invalid credentials')
}

const updateUser = async (req, res) => {
	const { name, email, password } = req.body

	const user = await User.findById(req.user.userId)

	if (name) {
		user.name = name
	}
	if (email) {
		user.email = email
	}
	if (password) {
		user.password = password
	}

	await user.save()

	res.status(StatusCodes.OK).json({
		user: {
			name: user.name,
			email: user.email,
			token: user.createJWT(),
		},
	})
}

const deleteUser = async (req, res) => {
	const result = await User.findByIdAndDelete(req.user.userId)

	if (result) {
		res.json({ msg: 'Account successfully deleted' })
	} else throw new BadRequestError('No account to delete')
}

module.exports = {
	register,
	login,
	updateUser,
	deleteUser,
}
