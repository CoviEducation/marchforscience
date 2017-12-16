'use strict';

module.exports = function(Lab) {
  Lab.on('dataSourceAttached', function(obj){
    var find = Lab.find;
    Lab.find = function(filter={}, auth, cb) {

      // // Don't infinite loop while including users (which in turn include Lab...)
      // if (cb && cb.name !== 'targetsFetchHandler'){
      //   filter.include = [{
      //     relation: 'admins',
      //     scope: {
      //       fields: ['firstName', 'lastName', 'image', 'bio'],
      //       include: {
      //         relation: 'adminroles'
      //       }
      //     }
      //   }];
      // }
      return find.call(this, filter, auth, cb);
    };
  });

};
