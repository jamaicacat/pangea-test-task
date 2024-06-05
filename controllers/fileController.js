const fs = require('fs')
const { StatusCodes } = require('http-status-codes')

const {
	CustomAPIError,
	NotFoundError,
	BadRequestError,
} = require('../errors/index')
const AWS_SERVICE = require('../services/aws')

const File = require('../models/File')

const getAllFiles = async (req, res) => {
	const files = await File.find({ owners: req.user.userId })

	res.status(StatusCodes.OK).json({ files })
}

const getFile = async (req, res) => {
	const {
		user: { userId },
		params: { id: fileId },
	} = req

	const file = await File.findOne({
		_id: fileId,
		owners: userId,
	})

	if (!file) {
		throw new NotFoundError(`No file with id '${fileId}'`)
	}

	res.status(StatusCodes.OK).json(file)
}

const updateFile = async (req, res) => {
	const {
		user: { userId },
		params: { id: fileId },
		body: { description, owners },
	} = req

	const file = await File.findOne({
		_id: fileId,
		owners: userId,
	})

	if (!file) {
		throw new NotFoundError(`No file with id '${fileId}'`)
	}

	if (description && description !== file.description) {
		file.description = description
	}

	if (owners) {
		if (owners.length) {
			file.owners = owners
		} else {
			throw new BadRequestError('Provide file owners')
		}
	}

	await file.save()

	res.status(StatusCodes.OK).json({ file })
}

const deleteFile = async (req, res) => {
	const fileId = req.params.id
	const userId = req.user.userId

	const file = await File.findOne({ _id: fileId, owners: userId })

	if (!file) {
		throw new NotFoundError(`No file with id '${fileId}'`)
	}

	if (file.owners.length > 1) {
		file.owners = file.owners.filter((id) => id.toString() !== userId)
		await file.save()
	} else {
		const fileDeletionResult = await AWS_SERVICE.deleteFile(file.key)

		if (!fileDeletionResult.$metadata.httpStatusCode === 204) {
			throw new CustomAPIError(`Couldn't delete file: ${fileId}`)
		}

		const result = await file.deleteOne()

		if (result.deletedCount !== 1) {
			throw new CustomAPIError(`Couldn't delete file: ${fileId}`)
		}
	}

	res.status(StatusCodes.OK).json({ msg: 'File successfully deleted' })
}

const uploadFile = async (req, res) => {
	const tempFile = req.files.file
	const key = `${new Date().getTime()}-${tempFile.name}`

	const fileUploadResult = await AWS_SERVICE.uploadFile(key, tempFile)

	if (fileUploadResult.$metadata.httpStatusCode === 200) {
		const file = await File.create({
			name: tempFile.name,
			key,
			description: req.body.description || '',
			owners: [req.user.userId],
		})

		res
			.status(StatusCodes.CREATED)
			.send({ msg: 'File was successfully uploaded', file })
	} else {
		throw new CustomAPIError(`File was not uploaded: ${fileUploadResult}`)
	}

	fs.unlink(tempFile.tempFilePath, (err) => {
		if (err) {
			console.error(`File deletion error: ${err}`)
		}
	})
}

const getFileLink = async (req, res) => {
	const {
		user: { userId },
		params: { id: fileId },
	} = req

	const file = await File.findOne({
		_id: fileId,
		owners: userId,
	})

	if (!fileId) {
		throw new NotFoundError(`No file with id '${fileId}'`)
	}

	const fileLink = await AWS_SERVICE.getFileLink(file.key)

	res.status(StatusCodes.OK).send({ file: fileLink })
}

module.exports = {
	getAllFiles,
	getFile,
	updateFile,
	deleteFile,
	uploadFile,
	getFileLink,
}
