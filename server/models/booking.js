
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var booking = new Schema({
  
  petId: String,
  time: { type : Date },
  createdAt: { type : Date, default: Date.now },
  updatedAt: { type : Date},
  serviceId: String,
  vendorId: String,
  status: { type: String, enum: ['cancelled', 'completed', 'booked'],default : "booked"},
  customerId: String

},{
  collection: 'bookings'
});

module.exports = mongoose.model('booking', booking);
