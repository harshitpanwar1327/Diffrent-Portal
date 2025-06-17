import {pool} from '../config/Database.js';

export const editConfigLogic = async (configData) => {
    try {
        const query = `UPDATE Config SET organization = ?, macAddress = ?, ipAddress = ?, date_enabled = ?, tagline_enabled = ?, layout = ?, qr_top_left = ?, qr_top_right = ?, qr_bottom_left = ?, qr_bottom_right = ?, whitelist_processes = ? WHERE groupId = ?`;

        const values = [
            configData.organization,
            configData.macAddress,
            configData.ipAddress,
            configData.date_enabled,
            configData.tagline_enabled,
            configData.layout,
            configData.qr_top_left,
            configData.qr_top_right,
            configData.qr_bottom_left,
            configData.qr_bottom_right,
            configData.whitelist_processes,
            configData.groupId
        ];

        await pool.query(query,values);
        return {success: true, message: "Config updated successfully"};
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Config not updated!" };
    }
}

export const getConfigLogic = async (groupId) => {
    try {
        let [rows] = await pool.query(`SELECT * FROM config WHERE groupID = ?`, [groupId]);
        return {success: true, data: rows};
    } catch (error) {
        console.error("Error during data insertion:", error);
        return {success: false, message: "Config details not found!"};
    }
}