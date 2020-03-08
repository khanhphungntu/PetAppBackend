
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var pet = new Schema({

  name: String,
  dateOfBirth: { type : Date },
  weight: Number,
  height: Number,
  type: String,
  customerId: String

},{
  collection: 'pets'
});

module.exports = mongoose.model('pet', pet);
