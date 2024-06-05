const { BadRequestError } = require('../errors/index')

const validateFile = async (req, res, next) => {
	if (!req.files) {
		throw new BadRequestError('File was not provided')
	}

	const file = req.files.file

	if (file.truncated) {
		// file size > 10 MB
		throw new BadRequestError('File size exceeds limit of 10 MB')
	}

	if (!file.name.match(/\.(jpg|jpeg|png|pdf|docx)\b/)) {
		throw new BadRequestError('Unsupported file type')
	}

	next()
}

module.exports = validateFile
