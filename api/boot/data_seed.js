'use strict';

var fetchUserData = require('../../data/users');
var fetchLabData = require('../../data/labs');
var fetchMembersData = require('../../data/members');

module.exports = function(server) {
  var Lab = server.models.lab;
  var User = server.models.user;
  var LabMembership = server.models.LabMembership;

  function cb(err) {
    console.log(err);
  }

  if (User) {

    fetchUserData().then((data) => {
      data = data.slice(0, 400); // TODO: Fix the data adapter to handle large datasets
      User.count({}, {}, (err, count) => {

        if (err) return cb(err);
        console.log('Seeding User Info');
        if (count !== 0) {
          console.log('Cleaning Old Data...')
          User.destroyAll(function (err) {
            if (err) {
              console.log('Error cleaning old data!', err);
              return cb(err);
            }
            console.log('Inserting New Data...')
            User.create(data, function (err) {
              if (err) {
                console.log('Error inserting new data!', err);
                return cb(err);
              }
              console.log('Finished inserting new user data!');
            });
          });
        }
        else {
          console.log('Inserting New Data...')
          User.create(data, function (err) {
            if (err) {
              console.log('Error inserting new data!', err);
              return cb(err);
            }
            console.log('Finished inserting new user data!');
          });
        }
      });
    });

  }

  User.count({ email: 'superuser@thepeoplesscience.org' }, (err, count) => {
    if (err) return cb(err);
    if (count !== 0) return;
    User.create({
      firstName: 'Super',
      lastName: 'User',
      email: 'superuser@thepeoplesscience.org',
      password: process.env.SUPERUSER_PASSWORD,
      phone: '1234567890',
      registered: Date.now(),
      role: 'admin',
      emailVerified: true,
      image: 'https://marchforscience.s3.amazonaws.com/b094f6140a64b3e932c43458773ded61'
    }, function (err, users) {
      if (err) return cb(err);
    });
  });

  if (Lab) {
    fetchLabData().then((data) => {
      Lab.count({}, {}, (err, count) => {
        if (err) return cb(err);
        console.log('Seeding Lab Info');
        if (count !== 0) {
          console.log('Cleaning Old Data...')
          Lab.destroyAll(function (err) {
            if (err) return cb(err);
            console.log('Inserting New Data...')
            Lab.create(data, function (err) {
              if (err) {
                console.log('Error inserting new lab data!', err);
                return cb(err);
              }
              console.log('Finished inserting new lab data!');
            });
          });
        }
        else {
          console.log('Inserting New Data...')
          Lab.create(data, function (err) {
            if (err) {
              console.log('Error inserting new lab data!', err);
              return cb(err);
            }
            console.log('Finished inserting new lab data!');
          });
        }
      });
    });
  }

  if (LabMembership) {
    fetchMembersData().then((data) => {
      console.log('Cleaning Old Data...')
      LabMembership.destroyAll(function (err) {
        if (err) return cb(err);
        console.log('Inserting New Data...')
        LabMembership.create(data, function (err) {
          if (err) {
            console.log('Error inserting new lab data!', err);
            return cb(err);
          }
          console.log('Finished inserting new lab data!');
        });
      });
    });
  }



};
