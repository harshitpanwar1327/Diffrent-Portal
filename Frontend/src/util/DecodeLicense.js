import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.SHA256("protectionmark").toString();

export const decodeLicenseCodeWithToken = (licenseKey) => {
    try {
        const bytes = CryptoJS.AES.decrypt(licenseKey.licenseKey, SECRET_KEY);
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