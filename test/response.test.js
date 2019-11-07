const { errData, errorRes, successRes } = require('../common/response')
const request = require('supertest');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app
.use(bodyParser.json())
.post('/errorRes', reqRes(errorRes))
.post('/successRes', reqRes(successRes))
.post('/errData', (req, res) => {
  const { errMsg, err } = req.body
  errData(res, errMsg) (err, { custom: true })
})

function reqRes (func) {
  return function (req, res) {
    return func(res, ...req.body)
  }
}

function test (funcStr, args) {
  return request(app)
          .post('/'+funcStr)
          .send(args)
}

describe ('response', function () {
  describe('errorRes', function () {
    it('should return default status code & message', function (done) {
      test('errorRes', ['error'])
        .expect(500, {
          success: false,
          error: 'failed operation'
        }, done)
    })

    it('should return custom errMsg', function (done) {
      test('errorRes', ['error', 'test'])
        .expect(500, {
          success: false,
          error: 'test'
        }, done)
    })

    it('should return custom errMsg & status code', function (done) {
      test('errorRes', ['error', 'test', 401])
        .expect(401, {
          success: false,
          error: 'test'
        }, done)
    })
  })

  describe('successRes', function () {
    it('should return default status code & data', function (done) {
      test('successRes', [])
        .expect(200, {
          success: true,
          data: {}
        }, done)
    })

    it('should return custom data', function (done) {
      test('successRes', [{ custom: true }])
        .expect(200, {
          success: true,
          data: { custom: true }
        }, done)
    })

    it('should return custom data & status code', function (done) {
      test('successRes', [{ custom: true }, 201])
        .expect(201, {
          success: true,
          data: { custom: true }
        }, done)
    })
  })

  describe('errData', function () {
    it('should return default status code & error', function (done) {
      test('errData', { err: true })
        .expect(500, {
          success: false,
          error: 'failed operation'
        }, done)
    })

    it('should return default status code & data', function (done) {
      test('errData', { err: false })
        .expect(200, {
          success: true,
          data: { custom: true }
        }, done)
    })

    it('should return custom error message', function (done) {
      test('errData', { err: true, errMsg: 'custom' })
        .expect(500, {
          success: false,
          error: 'custom'
        }, done)
    })
  })
})
