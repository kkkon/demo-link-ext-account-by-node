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

  ,linkExtAccount: function( uid, name, data, callback ) {

    var condition = {};
    condition['uid'] = uid;

    var update = {};
    update['$set'] = {};
    update['$set'][name] = data;

    //console.log('linkExtAccount');
    //console.log(update);

    this.update( condition, update, function(err,numberAffected,raw) {
      if (err) { console.log(err); }
      console.log('update numberAffected='+numberAffected);
      console.log(raw);
      return callback(err,numberAffected);
    });
  }

};

mongoose.model('UserExtAccount', UserExtAccountSchema);
