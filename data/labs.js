

const csv = require('csvtojson');
const path = require('path');

function fetchLabs(res) {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path.join(__dirname, './wp_thefieldproject.wp_bp_groups.csv'))
      .on('json', (obj) => {
        res.byId[obj['id']] = obj;
        res.list.push(obj);
      })
      .on('done', (err) => {
        if (err) { console.log('Error fetching labs'); return reject(err); }
        console.log('Finished fetching labs');
        resolve(res);
      })
  })
}

function fetchLabMeta(res) {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path.join(__dirname, './wp_thefieldproject.wp_bp_groups_groupmeta.csv'))
      .on('json', (obj) => {
        if (!res.byId[obj['group_id']]) { return; }
        res.byId[obj['group_id']][obj['meta_key']] = obj['meta_value'];
      })
      .on('done', (err) => {
        if (err) { console.log('Error fetching lab meta'); return reject(err); }
        console.log('Finished fetching lab meta');
        resolve(res);
      })
  })
}

module.exports = function fetch() {
  return fetchLabs({
    byId: {},
    list: []
  })
    .then(fetchLabMeta)
    .then((res) => {
      let data = [];
      res.list.forEach((obj) => {
        let out = {
          'id':           parseInt(obj['id']),
          'ownerId':      parseInt(obj['creator_id']),
          'name':         obj['name'],
          'slug':         obj['slug'],
          'description':  obj['description'],
          'created':      obj['date_created'],
          'lastActivity': obj['last_activity'],
          'memberCount':  parseInt(obj['total_member_count']),
          'country':      'US'
        };
        data.push(out);
      });
      return data;
    })
}
