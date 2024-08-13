const mongoose = require('mongoose')

const connectDB = (url) => {
	return mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() => console.log('CONNECTED TO DB...')).catch((err) =>console.log(err.message) )
}

module.exports = connectDB