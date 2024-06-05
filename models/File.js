const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Provide file name'],
			minLength: [4, 'Min file name length is 4 symbols'],
			maxLength: [120, 'Max file name length is 120 symbols'],
			trim: true,
		},
		key: {
			type: String,
		},
		description: {
			type: String,
			default: '',
		},
		owners: {
			type: [mongoose.Types.ObjectId],
			ref: 'User',
			required: true,
			minLength: 1,
		},
	},
	{ timestamps: true },
)

module.exports = mongoose.model('File', FileSchema)
