
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var vendor = new Schema({

  email: String,
  password: String,
  createdAt: { type : Date, default: Date.now },
  updatedAt: { type : Date},
  rememberToken:String,
  mobile: Number,
  name: String,
  postalCode: Number,
  address: String

},{
  collection: 'vendors'
});

module.exports = mongoose.model('vendor', vendor);
