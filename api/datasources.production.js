module.exports = {
  "gcloud-datastore": {
    "name": "gcloud-datastore",
    "connector": "gcloud",
    "projectId": process.env.GOOGLE_PROJECT_ID,
  },
  "mongo": {
    "connector": "mongodb",
    "host": "10.128.0.4",
    "port": 27017,
    "url": "",
    "database": "tps",
    "name": "tps",
    "password": "H1So4uKJ9r9T",
    "user": "root"
  }
};
