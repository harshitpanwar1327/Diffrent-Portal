import { pool } from '../config/Database.js';

export const addGroupLogic = async (groupData) => {
    try {
        const query = `INSERT INTO groupDetails( groupName )
        VALUES (?)`;
        const value = [
            groupData.groupName
        ];

        let [row] = await pool.query(query, value);
        let groupId = row.insertId;
        
        await pool.query(`INSERT INTO policy(groupId, usb, mtp, printing, browserUpload, bluetooth) VALUES (?, true, true, true, true, true);`, [groupId]);

        await pool.query(`INSERT INTO config(groupId, organization, macAddress, ipAddress, date_enabled, tagline_enabled, layout, qr_top_left, qr_top_right, qr_bottom_left, qr_bottom_right, whitelist_processes) VALUES (?, "ProtectionMark", true, true, true, true, "medium", true, true, true, true, "");`, [groupId]); 

        return { success: true, message: "Group Added Successfully" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Group not added!" };
    }
};

export const getGroupLogic =  async (limit, offset, search) => {
    try {
        let searchQuery = `%${search}%`;

        const [rows] = await pool.query(`SELECT * FROM groupDetails WHERE groupName LIKE ? OR groupId LIKE ? LIMIT ? OFFSET ?;`, [searchQuery, searchQuery, limit, offset]);
        const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM groupDetails WHERE groupName LIKE ? OR groupId LIKE ?;`, [searchQuery, searchQuery]);
        const total = countRows[0].total;

        return { success: true, data: rows, total };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve group data." };
    }
};

export const getAllGroupLogic = async () => {
    try {
        let [rows] = await pool.query(`SELECT * FROM groupDetails;`);

        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve group data." };
    }
}

export const getGroupByIdLogic = async (groupId) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM GroupDetails WHERE groupID=?`, [groupId]);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
}

export const updateGroupLogic = async (groupData) => {
    try {
        let query = `UPDATE groupDetails SET groupName=? WHERE groupId=?`;
        let values = [groupData.groupName, groupData.groupId];

        await pool.query(query, values);

        return { success: true, message: "Group Updated Successfully" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Group not Updated!" };
    }
}

export const deleteGroupLogic = async (groupId) => {
    try {
        let query = `DELETE FROM groupDetails WHERE groupId = ?`;
        let values = [groupId];

        await pool.query(query, values);

        await pool.query(`UPDATE devices SET groupId = null WHERE groupID = ?`, [groupId]);

        return {success: true, message: "Group deleted successfully"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "Group not deleted!"};
    }
}