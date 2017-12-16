

const csv = require('csvtojson');
const path = require('path');

function getType(obj) {
  if (obj['is_admin'] === '1') return 'admin';
  if (obj['is_mod'] === '1') return 'moderator';
  return 'member';
}

function fetchMembers(res) {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path.join(__dirname, './wp_thefieldproject.wp_bp_groups_members.csv'))
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

module.exports = function fetch() {
  return fetchMembers({
    byId: {},
    list: []
  })
    .then((res) => {
      let data = [];
      res.list.forEach((obj) => {
        let out = {
          // 'id': parseInt(obj['id']),
          'labId': parseInt(obj['group_id']),
          'userId': parseInt(obj['user_id']),
          'inviterId': parseInt(obj['inviter_id']),
          'type': getType(obj),
          'created': obj['date_modified'],
          'inviteSent': obj['invite_sent'] === '1'
        };
        data.push(out);
      });
      return data;
    })
}

module.exports();