import { pool } from '../config/Database.js';

export const addGroupLogic = async (groupData) => {
    try {
        const query = `INSERT INTO groupDetails( userId, groupName )
        VALUES (?, ?)`;
        const value = [
            groupData.userId,
            groupData.groupName
        ];

        let [row] = await pool.query(query, value);
        let groupId = row[0].groupId;
        
        await pool.query(`INSERT INTO policy VALUES (?, true, true, true, true, true);`, [groupId]);

        await pool.query(`INSERT INTO config VALUES (?, "ProtectionMark", true, true, true, true, "medium", true, true, true, true, "");`, [groupId]); 

        return { success: true, message: "Group Added Successfully" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Group not added!" };
    }
};

export const getGroupLogic =  async () => {
    try {
        const [rows] = await pool.query(`SELECT * FROM GroupDetails`);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve group data." };
    }
};

export const getGroupByIdLogic = async (groupID) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM GroupDetails WHERE groupID=?`, [groupID]);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
}

export const updateGroupLogic = async (groupData) => {
    try {
        let query = `UPDATE groupDetails SET groupName=? WHERE userId=?`;
        let values = [groupData.groupName, groupData.userId];

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

export const updatePolicyLogic = async (policyData) => {
    try {
        const query = `UPDATE policy SET usb = ?, mtp = ?, printing = ?, browserUpload = ?, bluetooth = ? WHERE groupId = ?`;

        const values = [policyData.usb, policyData.mtp, policyData.printing, policyData.browserUpload, policyData.bluetooth, policyData.groupId];

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