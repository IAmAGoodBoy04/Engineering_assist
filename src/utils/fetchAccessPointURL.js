const mongoose = require('mongoose');

const fetchAccessPointURL = async () => {
  const AccessPointModel = mongoose.model('AccessPoint', new mongoose.Schema({ url: String }, { collection: 'access_point' }));
  const accessPointDoc = await AccessPointModel.findOne();
  return accessPointDoc.url;
};

module.exports = fetchAccessPointURL;