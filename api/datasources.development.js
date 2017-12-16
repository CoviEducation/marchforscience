module.exports = {
  // "gcloud-datastore": {
  //   "name": "gcloud-datastore",
  //   "connector": "gcloud",
  //   "projectId": process.env.GOOGLE_PROJECT_ID,
  //   "keyFilename": "datastore-secret-key.json",
  //   "email": process.env.GOOGLE_SERVICE_ACCOUNT
  // }
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "mysql": {
    "name": "mydb",
    "connector": "mysql",
    "database": "tps",
    "host": "localhost",
    "username": "root",
    "password": ""
  },
  "mongo": {
    "connector": "mongodb",
    "host": "localhost",
    "port": 27017,
    "url": "",
    "database": "tps",
    "name": "tps"
    // "password": "mypassword",
    // "user": "me"
  }
};
