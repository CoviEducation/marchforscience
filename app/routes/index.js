import Ember from 'ember';

export default Ember.Route.extend({

  labs: Ember.inject.service('labs'),

  beforeModel(){
    this.get('labs').setup();
  },

});
