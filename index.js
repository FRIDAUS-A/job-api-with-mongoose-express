require('dotenv').config()
require('express-async-errors')

// extra secuirity packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express')
const app = express()
//conectDB
const connectDB = require('./db/connect')
const authenticationMiddleWare = require('./middleware/auth')

const authRouter = require('./routes/auth.route')
const jobsRouter = require('./routes/jobs.route')



app.set('trust proxy', 1)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15minutes
		max: 100, // limit each IP to 100 requests per windowMs
})
)



//error  middleware
const notFoundMiddleWare = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')


//routes
app.get('/', (req, res) => {
	res.send('<h1> JOB API IS WORKING FINE<h1><a href="/api-docs">Documentation</a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authenticationMiddleWare, jobsRouter)




app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)


const port = process.env.PORT

const start = async () => {
	await connectDB('mongodb+srv://ayobamifridaus:okoya@my-application.8n1wl.mongodb.net/JOBS-API?retryWrites=true&w=majority&appName=MY-APPLICATION')
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`)
	})
}


start()