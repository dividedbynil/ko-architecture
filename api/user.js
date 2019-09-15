const express = require('express')
const router = express.Router()
const { create, read, update, remove } = require('../common/crud')
const User = require('../models/User')
const { errorRes } = require('../common/response')
const { onlyAdmin, notFound } = require('../common/middleware')
const bcrypt = require('bcrypt')
const { saltRounds, jwtSecretSalt } = require('../config')


router
.use(onlyAdmin)

.post('/', create(User))
.get('/all/:page', usersAtPage, read(User))
.put('/:_id', handlePassword, update(User))
.delete('/:_id', remove(User))

.use(notFound)

function usersAtPage (req, res, next) {
	req.body = [ {}, null, { limit: 25, skip: (req.params.page-1) * 25 } ]
	return next()
}

function handlePassword (req, res, next) {
	const { password, ...body } = req.body
	if (!password || password.length < 1) {
		req.body = body
		return next()
	}
	if (password.length < 6)
		return errorRes(res, 'invalid password', 'password is too short')

	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err)
			return errorRes(res, err, 'password error')

		const data = {...body, password: hash}
		req.body = data
		return next()
	})
}

module.exports = router;
