
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var customer = new Schema({
  id: String,
  email: String,
  password: String,
  createdAt: { type : Date, default: Date.now },
  updatedAt: { type : Date },
  rememberToken:String,
  mobile: String,
  firstName: String,
  lastName: String,

  // // assume false
  // isPrivate: Boolean,

  // sp_uploader: String,
  // sp_editor: String,
  // sp_collector: String,
  // sp_pi: String,

  // sp_name: String,
  // sp_coldate: String,

  // sp_lat: Number,
  // sp_lon: Number,
  // sp_alt: Number,

  // sp_amount: String,
  // sp_collector_other: String,
  // sp_sloc_room: String,
  // sp_sloc: String,
  // sp_sdata: String,
  // sp_remark: String,
  // sp_obs: String,
  // ref_frame: String,
  // sp_fsrc: String,
  // datum: String,
  // projection: String,
  // igsn: String,
  // weblink: String,
  // sp_type: [String],
  // sp_type_other: String,
  // sp_rocktype: [String],
  // sp_rocktype_other: String,
  // sp_rockcomp: [String],
  // sp_rockcomp_other: String,
  // sp_wholecomp: Schema.Types.Mixed,
  // sp_ashSpec : Schema.Types.Mixed
},{
  collection: 'customers'
});

module.exports = mongoose.model('customer', customer);
