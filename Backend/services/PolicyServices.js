import { pool } from '../config/Database.js';

export const updatePolicyLogic = async (policyData) => {
    try {
        const query = `UPDATE policy SET usbmtp = ?, printing = ?, browserUpload = ?, bluetooth = ?, clipboard = ?, snipping = ?, blockedApps = ?, clipboardWhiteLists = ? WHERE groupId = ?`;

        const values = [policyData.usbmtp, policyData.printing, policyData.browserUpload, policyData.bluetooth, policyData.clipboard, policyData.snipping, policyData.blockedApps, policyData.clipboardWhiteLists, policyData.groupId];

        await pool.query(query, values);

        return { success: true, message: "Policy updated successfully" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Policy not updated!" };
    }
}

export const getPolicyLogic = async (groupId) => {
    try {
        let [rows] = await pool.query("SELECT * FROM policy WHERE groupId = ?", [groupId]);
        return {success: true, data: rows};
    } catch (error) {
        return {success: false, message: "Policy not fetched!"};
    }
}