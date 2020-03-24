
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var service = new Schema({

  name: String,
  vendorId: String,
  price: Number,
  description: String

},{
  collection: 'services'
});

module.exports = mongoose.model('service', service);
