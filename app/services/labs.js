import Ember from 'ember';
import Lab from '../models/lab';

export default Ember.Service.extend({
  init(){
    this.setup();
  },

  setup(){
    if ( this.promise ) return this.promise;
    return this.promise = new Promise((resolve, reject) => {
      return $.get(`/api/labs`).then((data) => {

        // Sort to help typeahead later on
        data = data.sort(function(obj1, obj2){
          if (obj1.city > obj2.city) return 1;
          if (obj1.city < obj2.city) return -1;
          if (obj1.state > obj2.state) return 1;
          if (obj1.state < obj2.state) return -1;
          if (obj1.country > obj2.country) return 1;
          if (obj1.country < obj2.country) return -1;
          return 0;
        });

        // Promote to Lab objects
        data.forEach((datum, index) => {
          data[index] = new Lab(datum);
        });

        this.set('list', data);
        resolve();
      }, (err) => {
        this.get('notifications').error('Error fetching lab data');
        reject();
      });

    });
  },

  list: []
});
