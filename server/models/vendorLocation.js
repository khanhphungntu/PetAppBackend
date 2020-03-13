
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var vendorLocation = new Schema({
  
  petId: String,
},{
  collection: 'vendorLocations'
});

module.exports = mongoose.model('vendorLocation', vendorLocation);
