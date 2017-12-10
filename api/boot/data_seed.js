'use strict';

var data = require('../../data/labdata');

module.exports = function(server) {
  var Lab = server.models.lab;
  var User = server.models.user;

  function cb(err) {
    console.log(err);
  }

  if (User) {
    User.count({ email: 'superuser@thepeoplesscience.org' }, (err, count) => {
      if (err) return cb(err);
      if (count !== 0) return;
      User.create({
        firstName: 'Super',
        lastName: 'User',
        email: 'superuser@thepeoplesscience.org',
        password: process.env.SUPERUSER_PASSWORD,
        phone: '1234567890',
        role: 'admin',
        emailVerified: true,
        image: 'https://marchforscience.s3.amazonaws.com/b094f6140a64b3e932c43458773ded61'
      }, function(err, users) {
        if (err) return cb(err);
      });
    });
  }

  if (Lab) {
    Lab.count({}, {}, (err, count) => {
      if (err) return cb(err);
      console.log('Seeding Lab Info');
      if (count !== 0) {
        console.log('Cleaning Old Data...')
        Lab.destroyAll(function(err, info){
          if (err) return cb(err);
          console.log('Inserting New Data...')
          Lab.create(data, function(err, users) {
            if (err) return cb(err);
          });
        });
      }
      else {
        console.log('Inserting New Data...')
        Lab.create(data, function (err, users) {
          if (err) return cb(err);
        });
      }
    });
  }

};
