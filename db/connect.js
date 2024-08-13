const mongoose = require('mongoose')

const connectDB = (url) => {
	return mongoose.connect(url).then(() => console.log('CONNECTED TO DB...')).catch((err) =>console.log(err.message) )
}

module.exports = connectDB