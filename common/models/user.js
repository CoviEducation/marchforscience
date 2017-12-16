'use strict';
var path = require('path');
var wphasher = require('wordpress-hash-node');
var bcrypt = require('bcrypt');

function createPromiseCallback() {
  var cb;
  var promise = new Promise(function (resolve, reject) {
    cb = function (err, data) {
      if (err) return reject(err);
      return resolve(data);
    };
  });
  cb.promise = promise;
  return cb;
}

module.exports = function(User) {
  User.on('dataSourceAttached', function(obj){
    var find = User.find;
    User.find = function(filter={}, auth, cb) {
      // // Don't infinite loop while including labs (which in turn include users...)
      // if (cb && cb.name !== 'targetsFetchHandler'){
      //   filter.include = [{
      //     relation: 'labs',
      //     scope: {
      //       fields: ['id', 'name', 'logo', 'city', 'state', 'country'],
      //     }
      //   }];
      // }
      return find.call(this, filter, auth, cb);
    };
  });


  User.afterRemote('create', function(context, userInstance, next) {

    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'noreply@marchforscience.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../emails/verify.ejs'),
      redirect: '/verified',
      user: User
    };

    userInstance.verify(options, function(err, response) {

      if (err) {
        console.error("Error sending user verification email", err);
        return next(err);
      }

      console.log('> verification email sent:', response);

      context.res.send({
        status: "Success",
        message: 'Signed up successfully. Please check your email and click on the verification link.'
      });
    });

  });

  // Overridden with backup check with wordpress password algo for legacy users.
  User.prototype.hasPassword = function (plain, fn) {
    fn = fn || createPromiseCallback();
    if (this.password && plain) {
      bcrypt.compare(plain, this.password, (err, isMatch) => {
        if (err) return fn(err);
        fn(null, isMatch || wphasher.CheckPassword(plain, this.password));
      });
    } else {
      fn(null, false);
    }
    return fn.promise;
  };

  // Overridden to pass through wordpress style hashed passwords without re-hasing on set.
  // Can be removed after final wordpress import.
  User.setter.password = function (plain) {
    if (typeof plain !== 'string') {
      return;
    }
    // The password is already hashed. It can be the case when the instance is loaded from DB
    if ((plain.indexOf('$2a$') === 0 && plain.length === 60) || (plain.indexOf('$P$B') === 0 && plain.length === 34)) {
      this.$password = plain;
    } else {
      this.$password = this.constructor.hashPassword(plain);
    }
  };

};
