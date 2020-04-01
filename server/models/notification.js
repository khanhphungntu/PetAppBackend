
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var notification = new Schema({
  time: { type : Date},
  petId: String,
  bookingId: String,
  vendorId: String,
  customerId: String,
  bookingStatus: { type: String, enum: ['cancelled', 'completed', 'booked', 'updated']},
  createdAt: {type: Date,default:Date.now}
},{
  collection: 'notifications'
});

module.exports = mongoose.model('notification', notification);
