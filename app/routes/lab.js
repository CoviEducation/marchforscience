import Ember from 'ember';
import Lab from '../models/lab';

const { get } = Ember;

export default Ember.Route.extend({

  labs: Ember.inject.service('labs'),
  session: Ember.inject.service('session'),

  beforeModel(){
    if ( this.get('session.isLoggedOut') ) window.location = "https://www.marchforscience.com/lab-marches";
    return this.get('labs').setup();
  },

  model(args){
    var sid = args.id;
    var sats = this.get('labs.list');
    var data = sats.find((obj) => {
      return get(obj, 'uriName') === sid || get(obj, 'id') === sid;
    });
    return $.get(`/api/labs/${data.id}`).then((data) => {
      return new Lab(data);
    });
  }

});
