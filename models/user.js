var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uid: { type: String, index: { unique: true } }
  // , 
});

/*
 static function
*/

UserSchema.statics = {

  load: function( options, callback ) {
    options.select = options.select || 'uid';
    this.findOne(options.criteria)
      .select( options.select)
      .exec(callback);
  }
};

mongoose.model('User', UserSchema);
