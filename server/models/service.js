
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var service = new Schema({
  id: String,
  name: String,
  vendorId: String,
  price: Number

},{
  collection: 'services'
});

module.exports = mongoose.model('service', service);
