import {LicenseModels} from '../models/LicenseModels.js';
import {generateLicenseLogic, decodeLicenseCodeWithToken, activateLicenseLogic, getLicenseLogic} from '../services/LicenseServices.js';

export const generateLicense = (req, res) => {
  try {
    const { organization, totalDevices, purchaseDate, expiryDate } = req.body;

    if (!organization || !totalDevices || !purchaseDate || !expiryDate) {
      return res.status(400).json({ error: "Fill all the required fields!" });
    }

    const { licenseCode, token } = generateLicenseLogic({
        organization,
        totalDevices,
        purchaseDate,
        expiryDate,
    });

    res.status(200).json({ licenseCode, token });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const validateLicense = (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: "License key not found!" });
    }

    const licenseData = decodeLicenseCodeWithToken(licenseKey);
    res.status(200).json(licenseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const activateLicense = async (req, res) => {
    let {userId, licenseKey} = req.body;

    if(!userId || !licenseKey) {
        res.status(400).json({success: false, message: "Fill all the required fields!"});
    }

    const licenseData = new LicenseModels({userId, licenseKey});

    try {
        let response = await activateLicenseLogic(licenseData);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const getLicense = async (req, res) => {
    try {
        let response = await getLicenseLogic();
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}