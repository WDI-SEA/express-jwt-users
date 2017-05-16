var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Let's craft how our JSON object should look!
// http://mongoosejs.com/docs/api.html#document_Document-toObject
UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var returnJson = {
            id: ret._id,
            email: ret.email,
            name: ret.name
        };
        return returnJson;
    }
});

UserSchema.methods.authenticated = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, res) {
      if (err) {
        callback(err);
      } else {
        callback(null, res ? this : false);
      }
  });
}

// Let's encrypt our passwords using only the model!
// This is a hook, a function that runs just before you save.
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // bcrypt can come up with a salt for us (just pass it a number)
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);
