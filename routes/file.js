const express = require('express')
const router = express.Router()

const fileUpload = require('express-fileupload')

const {
	getAllFiles,
	getFile,
	updateFile,
	deleteFile,
	uploadFile,
	getFileLink,
} = require('../controllers/fileController')

const authenticateUser = require('../middleware/authentication')
const validateFile = require('../middleware/validate-file')

router.use(authenticateUser)

router
	.route('/')
	.get(getAllFiles)
	.post(
		fileUpload({
			useTempFiles: true,
			limits: {
				fileSize: 1024 * 1024 * 10, // 10 MB
				files: 1,
			},
		}),
		validateFile,
		uploadFile,
	)
router.route('/:id').get(getFile).patch(updateFile).delete(deleteFile)
router.get('/:id/download/', getFileLink)

module.exports = router
