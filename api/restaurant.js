const express = require('express')
const router = express.Router()
const { create, read, update, remove } = require('../common/crud')
const Restaurant = require('../models/Restaurant')
const { notOnlyMember, notFound } = require('../common/middleware')


router
.get('/available/:lng/:lat/:page',
	nearBy({ available: true }),
	read(Restaurant, ['owner'])
)

.use(notOnlyMember)

.get('/all/:lng/:lat/:page', nearBy(), read(Restaurant, ['owner']))
.post('/', create(Restaurant, ['owner']))
.put('/:_id', update(Restaurant, ['owner']))
.delete('/:_id', remove(Restaurant))

.use(notFound)

function nearBy (query={}) {
	return (req, res, next) => {
		const { lng, lat, page } = req.params
		req.body = geoQuery(lng, lat, query, page)
		next()
	}
}

function geoQuery (lng, lat, query, page) {
	return(
		[
			{
				...query,
			  location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [lng, lat]
						}
					}
			  }
			},
			null
			, { limit: 25, skip: (page-1) * 25 }
		]
	)
}

module.exports = router
