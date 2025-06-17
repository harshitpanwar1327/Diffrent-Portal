import { pool } from '../config/Database.js';

export const getDevicesLogic =  async () => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Devices;`);
        return { success: true, data: rows };
    } catch (error) {
        console.log("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
};

export const getDevicesByGroupLogic = async (groupID) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Devices WHERE groupID = ? AND lastActive IS NOT NULL;`, [groupID]);
        return { success: true, data: rows };
    } catch (error) {
        console.log("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
}

export const manageDeviceGroupLogic = async (groupID) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Devices WHERE groupID = ? OR groupID IS NULL;`, [groupID]);
        return { success: true, data: rows };
    } catch (error) {
        console.log("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
}

export const deviceCountLogic = async () => {
    
    try {
        let [totalDevices] = await pool.query(`SELECT COUNT(*) AS count FROM devices;`);
        let [healthyDevices] = await pool.query(`SELECT COUNT(*) AS count FROM devices WHERE lastActive >= NOW() - INTERVAL 3 DAY`);
        let [retiredDevices] = await pool.query(`SELECT COUNT(*) AS count FROM devices WHERE lastActive > NOW ()- INTERVAL 30 DAY`);
        let [groupData] = await pool.query(`SELECT groupID, COUNT(*) AS count FROM devices WHERE groupID IS NOT NULL GROUP BY groupID`);
        let [licenseData] = await pool.query(`SELECT licenseKey, COUNT(*) AS count FROM devices WHERE licenseKey IS NOT NULL GROUP BY licenseKey`);

        return {success: true, data : {
            totalDevices,
            healthyDevices,
            retiredDevices,
            groupData,
            licenseData
        }}
    } catch (error) {
        console.log("Error fetching group data:", error);
        return { success: false, message: "Could not retrieve data." };
    }
}

export const updateDeviceGroupLogic = async (deviceData) => {
    try {
        await pool.query(`UPDATE devices SET groupID = ? WHERE macAddress = ?`, [deviceData.groupID, deviceData.macAddress]);

        return {success: true, message: "Group assigned successfully."};
    } catch (error) {
        console.log(error);
        return {success: false, message: "Group not assigned."};
    }
}

export const updateDeviceLicenseLogic = async (licenseKey, macAddress, deviceCount) => {
    try {
        let [allocatedLicense] = await pool.query(`SELECT COUNT(*) AS count FROM devices WHERE licenseKey = ?`, [licenseKey]);

        if(allocatedLicense[0]?.count >= deviceCount) {
            return {success: false, message: "Maximum device limit reached for this license."}
        }

        let respone = await pool.query(`UPDATE devices SET licenseKey = ? WHERE macAddress = ?`, [licenseKey, macAddress]);
        
        return {success: true, message: "licenseKey set succesfully."};
    } catch (error) {
        console.log(error);
        return {success: false, message: "licenseKey not set."};
    }
}

export const deallocateLicenseLogic = async (macAddress) => {
    try {
        let query = `UPDATE devices SET licenseKey = ? WHERE macAddress = ?;`;
        let values = [null, macAddress];

        await pool.query(query, values);

        return {success: true, message: "License deallocated successfully!"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "Deallocation failed!"}
    }
}

export const deleteDeviceLogic = async (macAddress) => {
    try {
        let query = `DELETE FROM devices WHERE macAddress=?`;
        let values = [macAddress];

        await pool.query(query, values);

        return {success: true, message: "Device deleted successfully!"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "Device not found!"}
    }
}