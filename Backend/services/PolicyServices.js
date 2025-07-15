import { pool } from '../config/Database.js';

export const updatePolicyLogic = async (policyData) => {
    try {
        const query = `UPDATE policy SET usb = ?, mtp = ?, printing = ?, browserUpload = ?, bluetooth = ?, clipboard = ?, blockedApps = ? WHERE groupId = ?`;

        const values = [policyData.usb, policyData.mtp, policyData.printing, policyData.browserUpload, policyData.bluetooth, policyData.clipboard, policyData.blockedApps, policyData.groupId];

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