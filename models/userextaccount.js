var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserExtAccountSchema = new Schema({
  // ref User._id
  uid: { type: String, index: { unique: true } }

  , google: {
    id: { type: String }
    , accessToken: { type: String }
    , refreshToken: { type: String }
  }
  , amazon: {
    id: { type: String }
    , accessToken: { type: String }
    , refreshToken: { type: String }
  }
});

UserExtAccountSchema.index( { 'google.id': 1 }, { unique: true, sparse: true } );
UserExtAccountSchema.index( { 'amazon.id': 1 }, { unique: true, sparse: true } );

/*
 static function

 e.g) UserExtAccountSchema.load

*/

UserExtAccountSchema.statics = {

  load: function(options, callback) {
    options.select = options.select || 'uid';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(callback);
  }
};

mongoose.model('UserExtAccount', UserExtAccountSchema);
