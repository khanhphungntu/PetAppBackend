
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var notification = new Schema({

  content: String,
  time: { type : Date, default: Date.now },
  customerId: String,
  vendorId: String

},{
  collection: 'notifications'
});

module.exports = mongoose.model('notification', notification);
