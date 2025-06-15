import {createLicenseCode, decodeLicenseCodeWithToken, activateLicense, getLicenseData} from '../services/LicenseServices.js';

export const generateLicense = (req, res) => {
  try {
    const { organization, totalDevices, purchaseDate, expiryDate } = req.body;

    if (!organization || !totalDevices || !purchaseDate || !expiryDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { licenseCode, token } = createLicenseCode({
        organization,
        totalDevices,
        purchaseDate,
        expiryDate,
    });

    res.status(200).json({ licenseCode, token });
  } catch (error) {
    console.error("Error saving configuration:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const validateLicense = (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: "License code and token are required" });
    }

    const licenseData = decodeLicenseCodeWithToken(licenseKey);
    res.status(200).json(licenseData);
  } catch (error) {
    console.error("Error saving configuration:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const activeLicense = async (req, res) => {
    let {licenseKey} = req.body;

    if(!licenseKey) {
        res.status(400).json({success: false, message: "License details not found."});
    }

    try {
        let response = await activateLicense(licenseKey);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getLicense = async (req, res) => {
    try {
        let response = await getLicenseData();
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}