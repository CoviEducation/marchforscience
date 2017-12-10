import Ember from 'ember';
import country_data from 'npm:country-data';
import customSuggestionTemplate from '../templates/components/lab-typeahead/suggestion';

const { get, set } = Ember;

function displayName(city='', state='', country='') {
  country = country_data.countries[country];
  country = country ? (country = country.name) : ''
  return `${city}, ${state ? state + ', ': ''}${country}`
}

export default Ember.Controller.extend({

  labs: Ember.inject.service('labs'),

  init(){
    this.labQuery = this.labQuery.bind(this);
  },

  customSuggestionTemplate: customSuggestionTemplate,

  labQuery(query, syncResults) {
    const regex = new RegExp(`.*${query}.*`, 'i');

    var filtered = this.get('labs.list').filter((item) => {
      return regex.test(get(item, 'displayName'));
    });
    syncResults(filtered);
  },

  transformSelection(selection){
    return (selection) ? get(selection, 'displayName') : '';
  },

  labCount: Ember.computed('labs.list', function(){
    return (this.get('labs.list') || []).length;
  }),

  actions: {
    selectLabTypeahead(data){
      // if (data) this.transitionToRoute('lab', get(data, 'uriName'));
      if ( !data ) return;
      var url = get(data, 'website') || get(data, 'facebook') || get(data, 'twitter') || get(data, 'instagram') || ( get(data, 'email') && 'mailto:'+get(data, 'email') );
      url && window.open(url, "_blank");
      return false;
    }
  }

});