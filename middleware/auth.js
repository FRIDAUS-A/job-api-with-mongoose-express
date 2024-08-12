const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleWare = (req, res, next) => {
	// check header
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthenticatedError('Authentication Invalid')
	}
	const token = authHeader.split(' ')[1]
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		req.user = { userId: payload.userId, name:payload.name }
	} catch (err) {
		throw new UnauthenticatedError('Authentication Invalid')
	}
	return next()
}

module.exports = authenticationMiddleWare