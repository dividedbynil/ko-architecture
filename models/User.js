const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const validator = require('validator')


const userSchema = new Schema({
  _id: ObjectId,
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [ validator.isEmail, 'invalid email' ]
  },
  type: {
    type: String,
    enum: ['member', 'owner', 'admin'],
    required: true
  },
  password: { type: String, required: true, select: false },

  updated_at: Date,
});

module.exports = mongoose.model('User', userSchema, 'users');
