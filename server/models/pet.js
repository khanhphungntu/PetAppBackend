
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var pet = new Schema({

  name: String,
  dateOfBirth: { type : Date, default: Date.now},
  weight: Number,
  height: Number,
  type: String,
  customerId: String,
  deletedAt: {type : Date, default: null},

},{
  collection: 'pets'
});

module.exports = mongoose.model('pet', pet);
