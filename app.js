require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const authRouter = require('./routes/auth')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// routes
app.use('/api/v1/auth', authRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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
