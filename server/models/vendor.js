
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var vendor = new Schema({
  name: String,
  email: String,
  password: String,
  address: String
},{
  collection: 'vendors'
});

module.exports = mongoose.model('vendor', vendor);
