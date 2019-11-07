const { notFound, onlyAdmin, notOnlyMember } = require('../common/middleware')
const request = require('supertest');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app
.use(bodyParser.json())
.post('/notFound', notFound)
.post('/onlyAdmin', addUserType, onlyAdmin, notFound)
.post('/notOnlyMember', addUserType, notOnlyMember, notFound)

function addUserType (req, res, next) {
  req.user = { type: req.body.type }
  next()
}

function test (funcStr, args) {
  return request(app)
          .post('/'+funcStr)
          .send({ type: args })
}

describe('middleware', function () {
  describe('notFound', function () {
    it('should return not found', function (done) {
      test('notFound')
        .expect(404, done)
    })
  })

  describe('onlyAdmin', function () {
    it('should access', function (done) {
      test('onlyAdmin', 'admin')
        .expect(404, done)
    })
    it('should not access', function (done) {
      test('onlyAdmin', 'member')
        .expect(401, done)
    })
  })

  describe('notOnlyMember', function () {
    it('should access', function (done) {
      test('notOnlyMember', 'admin')
        .expect(404, done)
    })
    it('should access', function (done) {
      test('notOnlyMember', 'owner')
        .expect(404, done)
    })
    it('should not access', function (done) {
      test('notOnlyMember', 'member')
        .expect(401, done)
    })
  })
})
