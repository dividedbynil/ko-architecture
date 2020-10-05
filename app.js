const express = require('express');
const path = require('path');
const logger = require('morgan');
const api = require('./api');
const { notFound } = require('./common/middleware')
const cors = require('cors')
const app = express();

app
.use(cors())

.use(logger('dev'))
.use(express.json())

.use('/api', api)

.use(notFound)

module.exports = app;
