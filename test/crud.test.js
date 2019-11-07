const { create, read, update, remove } = require('../common/crud')
const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const request = require('supertest')
const expect = require('chai').expect
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const { testMongoUrl } = require('../config')
const app = express()

mongoose.connect(testMongoUrl, {
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

app
.use(bodyParser.json())
.post('/create', create(Restaurant, ['owner']))
.post('/read', read(Restaurant, ['owner']))
.post('/update/:_id', update(Restaurant, ['owner']))
.post('/remove/:_id', remove(User))

function test (funcStr, args) {
  return request(app)
          .post('/'+funcStr)
          .send(args)
}

describe('crud', function () {
  const user = {
    "name": "Test",
    "email": "test@test.com",
    "type": "admin",
    "password": "12345"
  }

  const restaurant = {
    "name": "Brand New Restaurant",
    "location": {
      "type": "Point",
      "coordinates": [-73.9983, 40.715051]
    },
    "available": true
  }

  const testUser = new User({
    _id: new mongoose.Types.ObjectId(),
    ...user
  })

  before(function (done) {
    testUser.save(done)
  })

  after(function (done) {
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done)
    })
  })

  describe('create', function () {
    it('should not create new restaurant without owner', function (done) {
      const data = restaurant
      test('create', data)
        .expect(500, done)
    })
    it('should return new restaurant and populate', function (done) {
      const data = { owner: testUser._id, ...restaurant }
      test('create', data)
        .expect(200)
        .expect(function (res) {
          restaurant._id = res.body.data._id
          expect(res.body.data).to.be.a('object')
          expect(res.body.data).to.deep.include(restaurant)
          expect(res.body.data.owner.name).to.equal('Test')
          expect(res.body.data.owner.password).to.equal(undefined)
        })
        .end(done)
    })
  })

  describe('read', function () {
    it('should return restaurant and populate', function (done) {
      const data = [{ "available": true, _id: restaurant._id }]
      test('read', data)
        .expect(200)
        .expect(function (res) {
          expect(res.body.data).to.be.a('array')
          expect(res.body.data[0]).to.deep.include(restaurant)
          expect(res.body.data[0].owner.name).to.equal('Test')
          expect(res.body.data[0].owner.password).to.equal(undefined)
        })
        .end(done)
    })
    it('should return no restaurant', function (done) {
      const data = [{ "available": false }]
      test('read', data)
        .expect(200)
        .expect(function (res) {
          expect(res.body.data.length).to.equal(0)
        })
        .end(done)
    })
  })

  describe('update', function () {
    it('should return updated restaurant and populate', function (done) {
      const { _id } = restaurant
      const data = { name: 'New name' }
      test('update/'+_id, data)
        .expect(200)
        .expect(function (res) {
          expect(res.body.data).to.be.a('object')
          expect(res.body.data).to.deep.include({...restaurant, ...data})
          expect(res.body.data.name).to.equal('New name')
          expect(res.body.data.owner.name).to.equal('Test')
          expect(res.body.data.owner.password).to.equal(undefined)
        })
        .end(done)
    })
  })

  describe('remove', function () {
    it('should remove user', function (done) {
      const { _id } = testUser
      test('remove/'+_id)
        .expect(200)
        .expect(function (res) {
          expect(res.body.data).to.be.a('object')
          expect(res.body.data).to.have.property('ok')
          expect(res.body.data.ok).to.equal(1)
        })
        .end(done)
    })
  })

})
