var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uid: { type: String, index: { unique: true } }
  // , 
});

mongoose.model('User', UserSchema);
