const SiteSettings = require('../models/SiteSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      primaryColor,
      secondaryColor,
      buttonColor,
      backgroundColor,
      accentColor,
      siteName,
      slogan
    } = req.body;

    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create({
        primaryColor,
        secondaryColor,
        buttonColor,
        backgroundColor,
        accentColor,
        siteName,
        slogan
      });
    } else {
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        {
          primaryColor: primaryColor || settings.primaryColor,
          secondaryColor: secondaryColor || settings.secondaryColor,
          buttonColor: buttonColor || settings.buttonColor,
          backgroundColor: backgroundColor || settings.backgroundColor,
          accentColor: accentColor || settings.accentColor,
          siteName: siteName || settings.siteName,
          slogan: slogan || settings.slogan
        },
        { new: true }
      );
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
