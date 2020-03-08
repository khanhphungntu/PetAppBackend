
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var service = new Schema({

  name: String,
  vendorId: String,
  price: Number

},{
  collection: 'services'
});

module.exports = mongoose.model('service', service);
