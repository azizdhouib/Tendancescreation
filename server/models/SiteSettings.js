const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#9B4D96'
  },
  secondaryColor: {
    type: String,
    default: '#E85A8B'
  },
  buttonColor: {
    type: String,
    default: '#D4548A'
  },
  backgroundColor: {
    type: String,
    default: '#FDF5F8'
  },
  accentColor: {
    type: String,
    default: '#F5A623'
  },
  siteName: {
    type: String,
    default: 'Tendance&Creations'
  },
  slogan: {
    type: String,
    default: 'Des bouquets personnalisés pour des cadeaux uniques'
  },
  logoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
