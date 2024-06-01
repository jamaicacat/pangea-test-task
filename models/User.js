const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Provide name'],
		minLength: 3,
		maxLength: 50,
		trim: true,
	},
	password: {
		type: String,
		minLength: [6, 'Minimal length of password is 6 characters'],
		required: [true, 'Provide password'],
	},
	email: {
		type: String,
		required: [true, 'Provide email'],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Incorrect email template was passed',
		],
		unique: true,
		trim: true,
	},
})

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)

	next()
})

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		},
	)
}

UserSchema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password)

	return isMatch
}

module.exports = mongoose.model('User', UserSchema)
