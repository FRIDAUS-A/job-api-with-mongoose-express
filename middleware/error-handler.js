const { StatusCodes } = require('http-status-codes')
const { CustomAPIError } = require('../errors')

const errorHandlerMiddleWare = (err, req, res, next) => {

	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err
	}
	if (err instanceof CustomAPIError) {
		res.status(err.statusCode).json({
			message: err.message
		})
	}
	if (err && err.code === 11000) {
		customError.message = `Duplicate value entered for ${Object.values(err.keyValue)} field, please choose another value`
		customError.statusCode = 400
	}
	if (err.name === 'ValidationError') {
		customError.message = Object.values(err.errors).map((item) => item.message).join(',')
		customError.statusCode = 400
	}
	if (err.name === 'CastError') {
		customError.message = `No item found with id: ${err.value}`
		customError.statusCode = 404
	}

	//res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})

	res.status(customError.statusCode).json({
		message: customError.message
	})
}


module.exports = errorHandlerMiddleWare