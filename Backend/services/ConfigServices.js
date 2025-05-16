import {pool} from '../config/Database.js';

export const insertConfigTable = async (configData) => {
    try {
        const query = `UPDATE Config SET organization = ?, macAddress = ?, ipAddress = ?, date_enabled = ?, tagline_enabled = ?, layout = ?, qr_top_left = ?, qr_top_right = ?, qr_bottom_left = ?, qr_bottom_right = ?, whitelist_processes = ? WHERE groupID = ?`;

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
            configData.id
        ];
        await pool.query(query,values);
        return {success: true, message: "Data Saved Successfully"};
        
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Data not Saved! Please try again..." };
    }
}

export const getConfigData = async (groupID) => {
    try {
        let [rows] = await pool.query(`SELECT * FROM config WHERE groupID = ?`, [groupID]);
        return {success: true, data: rows};
    } catch (error) {
        console.error("Error during data insertion:", error);
        return {success: false, message: "Config details not found."};
    }
}