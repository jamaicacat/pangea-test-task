const { CustomAPIError } = require('../errors/index')

const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const client = new S3Client({
	region: process.env.AMAZON_REGION,
	credentials: {
		accessKeyId: process.env.AMAZON_ACCESS_KEY,
		secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
	},
})

const fs = require('fs')

const uploadFile = async (key, file) => {
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_BUCKET,
		Key: key,
		Body: fs.createReadStream(file.tempFilePath),
	})

	try {
		const response = await client.send(command)

		return response
	} catch (err) {
		throw new CustomAPIError(`Couldn't upload the file: ${err.message}`)
	}
}

const getFileLink = async (filename) => {
	const command = new GetObjectCommand({
		Bucket: process.env.AWS_BUCKET,
		Key: filename,
	})

	try {
		const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 })

		return signedUrl
	} catch (error) {
		throw new CustomAPIError(
			`Couldn't get download link for the file: ${err.message}`,
		)
	}
}

const deleteFile = async (key) => {
	const command = new DeleteObjectCommand({
		Bucket: process.env.AWS_BUCKET,
		Key: key,
	})

	try {
		const response = await client.send(command)

		return response
	} catch (err) {
		throw new CustomAPIError(`Couldn't delete the file: ${err.message}`)
	}
}

module.exports = {
	uploadFile,
	getFileLink,
	deleteFile,
}
