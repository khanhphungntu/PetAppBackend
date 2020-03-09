const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var customer = new Schema({

  email: String,
  password: String,
  createdAt: { type : Date, default: Date.now },
  updatedAt: { type : Date },
  rememberToken:String,
  mobile: String,
  firstName: String,
  lastName: String,

},{
  collection: 'customers'
});

module.exports = mongoose.model('customer', customer);
