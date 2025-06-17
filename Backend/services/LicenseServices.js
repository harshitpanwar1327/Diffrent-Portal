import { pool } from '../config/Database.js';
import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.SHA256("protectionmark").toString(); 

export const generateLicenseLogic = ({ organization, totalDevices, purchaseDate, expiryDate }) => {
  const dataString = `${organization}|${totalDevices}|${purchaseDate}|${expiryDate}`;
  const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();

  return { licenseCode: encrypted };
};

export const decodeLicenseCodeWithToken = (licenseKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(licenseKey, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) throw new Error("Invalid License Code");

    const fields = decryptedData.split("|");
    if (fields.length !== 4) throw new Error("Malformed License Code");

    const [organization, totalDevices, purchaseDate, expiryDate] = fields;

    if (isNaN(new Date(purchaseDate)) || isNaN(new Date(expiryDate))) {
      throw new Error("Invalid date format");
    }

    return {
      organization,
      totalDevices,
      purchaseDate,
      expiryDate
    };
  } catch (error) {
    throw new Error("Invalid License Code");
  }
};

export const activateLicense = async (licenseKey) => {
  try {
    let query = `INSERT INTO license VALUES (?);`;
    let values = [licenseKey];

    await pool.query(query, values);
    return { success: true, message: "License activated successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "License not activated." };
  }
};

export const getLicenseLogic = async () => {
  try {
    let [rows] = await pool.query(`SELECT * FROM license;`);
    return { success: true, data: rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Active license not found." };
  }
};