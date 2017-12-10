'use strict';
var path = require('path');

module.exports = function(User) {
  User.on('dataSourceAttached', function(obj){
    var find = User.find;
    User.find = function(filter={}, auth, cb) {
      // Don't infinite loop while including labs (which in turn include users...)
      if (cb && cb.name !== 'targetsFetchHandler'){
        filter.include = [{
          relation: 'labs',
          scope: {
            fields: ['id', 'name', 'logo', 'city', 'state', 'country'],
          }
        }];
      }
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




};
