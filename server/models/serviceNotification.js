
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var serviceNotification = new Schema({
    userId: String,
    deviceId: [String]
},{
  collection: 'serviceNotifications'
});

module.exports = mongoose.model('serviceNotification', serviceNotification);
