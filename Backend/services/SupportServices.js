import { pool } from '../config/Database.js';

export const ticketDetailsLogic = async (supportData) => {
    try {
        const SupportQuery = `INSERT INTO Support ( ticketID, groupID, deviceName, issueType, 
        description, screenshot, urgency) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const SupportValues = [ 
            supportData.ticketID, 
            supportData.groupID, 
            supportData.deviceName, 
            supportData.issueType, 
            supportData.description, 
            supportData.screenshot, 
            supportData.urgency
        ];
        await pool.query(SupportQuery, SupportValues);

        return { success: true, message: "Data Saved Successfully!" };
    } catch (error) {
        console.error("Error during data insertion:", error);
        return { success: false, message: "Data not Saved! Please try again..." };
    }
};