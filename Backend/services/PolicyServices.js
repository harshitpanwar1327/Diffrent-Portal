import { pool } from '../config/Database.js';

export const addGroupLogic = async (groupData) => {
    try {
        const query = `INSERT INTO groupDetails ( groupID, groupName )
        VALUES (?, ?)`;
        const value = [
            groupData.groupID,
            groupData.groupName
        ];

        await pool.query(query, value);

        await pool.query(`INSERT INTO policy VALUES (?, true, true, true, true, true);`, [groupData.groupID]);

        await pool.query(`INSERT INTO config VALUES (?, "ProtectionMark", true, true, true, true, "medium", true, true, true, true, "");`, [groupData.groupID]);

        return { success: true, message: "Data Saved Successfully!" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Data not Saved! Please try again..." };
    }
};

export const getGroupLogic =  async () => {
    try {
        const [rows] = await pool.query(`SELECT * FROM GroupDetails`);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
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
        let query = `UPDATE groupDetails SET groupName=? WHERE groupID=?`;
        let values = [groupData.groupName, groupData.groupID];

        await pool.query(query, values);

        return { success: true, message: "Data Updated Successfully!" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Data not Updated! Please try again..." };
    }
}

export const deleteGroupLogic = async (groupID) => {
    try {
        let query = `DELETE FROM groupDetails WHERE groupID = ?`;
        let values = [groupID];

        await pool.query(query, values);

        await pool.query(`UPDATE devices SET groupID = null WHERE groupID = ?`, [groupID]);

        return {success: true, message: "Group Deleted Successfully!"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "Group Not Deleted!"};
    }
}

export const updatePolicyLogic = async (policyData) => {
    try {
        const query = `UPDATE policy SET usb = ?, mtp = ?, printing = ?, browserUpload = ?, bluetooth = ? WHERE groupID = ?`;

        const values = [policyData.usb, policyData.mtp, policyData.printing, policyData.browserUpload, policyData.bluetooth, policyData.groupID];

        await pool.query(query, values);

        return { success: true, message: "Policy Saved Successfully!" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Policy not Saved! Please try again..." };
    }
}

export const getPolicyLogic = async (groupID) => {
    try {
        let [rows] = await pool.query("SELECT * FROM policy WHERE groupID = ?", [groupID]);
        return {success: true, data: rows};
    } catch (error) {
        return {success: false, message: "Policy not fetched!"};
    }
}