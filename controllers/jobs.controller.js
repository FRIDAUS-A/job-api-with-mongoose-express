const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/jobs.model')
const { StatusCodes } = require('http-status-codes')





const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)
	res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({
		createdBy: req.user.userId
	}).sort('createdAt')
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {

	// nested destructuring
	const { 
		user: { userId }, 
		params: { id:jobId } 
	} = req

	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId
	})

	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`)
	}

	res.status(StatusCodes.OK).json({ job })
}

const updateJob = async (req, res) => {
	const {
		body: {company, postion},
		user: { userId },
		params: {id: jobId}
	} = req
	
	if (company === '' || postion === '') {
		throw new BadRequestError('Comapny or Postion fields cannot be empty')
	}
	const job = await Job.findOneAndUpdate({_id:jobId, createdBy:userId}, req.body, {
		new: true,
		runValidators: true
	})
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`)
	}
	res.status(StatusCodes.OK).json({
		job: job
	})
}

const deleteJob = async (req, res) => {
	const {
		user: {userId},
		params: {id: jobId}
	} = req

	const job = await Job.findOneAndDelete({
		_id: jobId,
		createdBy: userId
	})
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`)
	}
	res.status(StatusCodes.OK).json({
		message: "Deleted Successfully"
	})
}


module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob
}
