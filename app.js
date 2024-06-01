require('dotenv').config()

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () =>
			console.log(`✔️  Server is listening on port ${port}...`),
		)
	} catch (error) {
		console.log('❌ Error occured while starting server', error)
	}
}

start()
