
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var unavailableDate = new Schema({

  date: {type: Date},
  vendorId: String

},{
  collection: 'unavailableDates'
});

module.exports = mongoose.model('unavailableDate', unavailableDate);
  