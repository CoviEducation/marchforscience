'use strict';

module.exports = function (app) {
  var Role = app.models.Role;

  Role.registerResolver('LabOwner', function (role, context, cb) {

    function reject() {
      process.nextTick(function () {
        cb(null, false);
      });
    }

    // if the target model is not lab
    if (context.modelName !== 'lab') {
      return reject();
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    // check if userId is in team table for the given lab id
    var Lab = app.models.Lab;
    Lab.count({
      id: context.modelId,
      owner: userId
    }, function (err, count) {

      if (err) {
        console.log(err);
        return cb(null, false);
      }

      cb(null, count > 0); // true = is a team member
    });
  });
};
