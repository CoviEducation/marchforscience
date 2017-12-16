const csv = require('csvtojson');
const path = require('path');

function getRoleType(roleData) {
  if (!roleData) { return void 0; }
  if (!!~roleData.indexOf('administrator')) { return 'admin'; }
  if (!!~roleData.indexOf('researcher')) { return 'researcher'; }

}

function fetchUsers(res) {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path.join(__dirname, './wp_thefieldproject.wp_users.csv'))
      .on('json', (obj) => {
        res.byId[obj['ID']] = obj;
        res.list.push(obj);
      })
      .on('done', (err) => {
        if (err) { console.log('Error fetching users'); return reject(err); }
        console.log('Finished fetching users');
        resolve(res);
      })
  })
}

function fetchUserMeta(res) {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path.join(__dirname, './wp_thefieldproject.wp_usermeta.csv'))
      .on('json', (obj) => {
        if (!res.byId[obj['user_id']]) { return; }
        res.byId[obj['user_id']][obj['meta_key']] = obj['meta_value'];
      })
      .on('done', (err) => {
        if (err) { console.log('Error fetching user meta'); return reject(err); }
        console.log('Finished fetching user meta');
        resolve(res);
      })
  })
}

module.exports = function fetch() {
  return fetchUsers({
    byId: {},
    list: []
  })
  .then(fetchUserMeta)
  .then((res) => {
    let data = [];
    res.list.forEach((obj) => {
      let out = {
        'id':                 parseInt(obj['ID']),
        'password':           obj['user_pass'],
        'username':           obj['user_nicename'],
        'email':              obj['user_email'],
        'url':                obj['user_url'],
        'registered':         obj['user_registered'],
        'verificationToken':  obj['user_activation_key'],
        'emailVerified':     !obj['user_activation_key'],
        'firstName':          obj['display_name'].split(' ')[0],
        'lastName':           obj['display_name'].split(' ').slice(1).join(' '),
        'description':        obj['description'],
        'title':              obj['profile.tagline'],
        'location':           obj['profile.location'],
        'role':               getRoleType(obj['wp_capabilities']),
        'lastActivity':       obj['last_activity'],
        'instagram':          obj['instagram'],
        'facebook':           obj['facebook'],
        'twitter':            obj['twitter'],
        'linkedin':           obj['linkedin']
        // 'capabilities':       obj['wp_capabilities']
      };
      data.push(out);
    });

    return data;
  })
}
