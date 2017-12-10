import Ember from 'ember';

var { get, set } = Ember

export default Ember.Route.extend({

  labs: Ember.inject.service('labs'),

  beforeModel(){
    return this.get('labs').setup();
  },

  model(){
      return { };
  }

});
