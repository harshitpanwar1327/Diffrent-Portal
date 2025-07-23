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

    if (!decryptedData) {
      return {success: false, message: "Invalid License Code"};
    }

    const fields = decryptedData.split("|");
    if (fields.length !== 4) {
      return {success: false, message: "Malformed License Code"};
    }

    const [organization, totalDevices, purchaseDate, expiryDate] = fields;

    if (isNaN(new Date(purchaseDate)) || isNaN(new Date(expiryDate))) {
      return {success: false, message: "Invalid date format"};
    }

    return {
      organization,
      totalDevices,
      purchaseDate,
      expiryDate
    };
  } catch (error) {
    console.log(error);
    return {success: false, message: "Invalid License Code"};
  }
};

export const activateLicenseLogic = async (licenseData) => {
  try {
    let query = `INSERT INTO license(licenseKey) VALUES (?);`;
    let values = [licenseData.licenseKey];

    await pool.query(query, values);
    return { success: true, message: "License activated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "License not activated!" };
  }
};

export const getAllLicenseLogic = async (id) => {
  try {
    let [rows] = await pool.query(`SELECT * FROM license;`, [id]);

    return { success: true, data: rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "License not found!" };
  }
}

export const deleteLicenseLogic = async (id) => {
  try {
    let query = `DELETE FROM license WHERE licenseId = ?`;
    let values = [id];
    await pool.query(query, values);

    return { success: true, message: "License deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Unable to delete license!" };
  }
}

export const getLicenseLogic = async (limit, offset, search) => {
  try {
    let [rows] = await pool.query(`SELECT * FROM license LIMIT ? OFFSET ?;`, [limit, offset]);
    let [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM license;`);
    const total = countRows[0].total;

    return { success: true, data: rows, total };
  } catch (error) {
    console.log(error);
    return { success: false, message: "License not found!" };
  }
};