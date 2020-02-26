const express = require('express')
const router = express.Router()
const User = require('../models/User')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const { errorRes, successRes, errData } = require('../common/response')
const { notFound } = require('../common/middleware')
const bcrypt = require('bcrypt')
const { saltRounds, jwtSecretSalt } = require('../config')


router
.use(isValidPassword)
.post('/signup', hashPassword, signUp)
.post('/login', findByEmail, verifyPassword, login)

.use(notFound)

function isValidPassword (req, res, next) {
	const { password } = req.body
	if (!password || password.length < 6) {
		const err = `invalid password: ${password}`
		const errMsg = 'password is too short'
		return errorRes(res, err, errMsg)
	}
	return next()
}

function hashPassword (req, res, next) {
	const { password } = req.body
	bcrypt.hash(password, saltRounds, (err, hashed) => {
		if (err)
			return errorRes(res, err, 'unable to sign up, try again')
		req.body.password = hashed
		return next()
	})
}

function signUp (req, res) {
	const newUser = new User({
		_id: new mongoose.Types.ObjectId(),
		...req.body
	})
	return newUser.save((err, data) => {
		if (err)
			return errorRes(res, err, 'unable to create user')

		const { _id, name, email, type } = data
		return successRes(res, { _id, name, email, type })
	})
}

function findByEmail (req, res, next) {
	const { email, password } = req.body
	User.findOne({ email }, '+password', { lean: true } , (err, data) => {
		if (err || !data)
			return errorRes(res, 'invalid login', 'invalid password or email')
		req.body = { unhashedPassword: password , ...data }
		return next()
	})
}

function verifyPassword (req, res, next) {
	const { unhashedPassword, password, ...userData } = req.body
	bcrypt.compare(unhashedPassword, password, (err, same) => {
	  if (same) {
	  	req.body = userData
	  	return next()
	  } else
			return errorRes(res, err, 'password error, try again')
	})
}

function login (req, res) {
	jwt.sign(req.body, jwtSecretSalt,
		{algorithm: 'HS512', expiresIn: '31d'},
		errData(res, 'token error')
	)
}

module.exports = router;
