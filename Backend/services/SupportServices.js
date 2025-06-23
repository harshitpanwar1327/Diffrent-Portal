import { pool } from '../config/Database.js';

export const ticketDetailsLogic = async (supportData) => {
    try {
        const query = `INSERT INTO Support (userId, ticketID, groupID, deviceName, issueType, 
        description, screenshot, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ 
            supportData.userId,
            supportData.ticketID, 
            supportData.groupID, 
            supportData.deviceName, 
            supportData.issueType, 
            supportData.description, 
            supportData.screenshot, 
            supportData.urgency
        ];
        await pool.query(query, values);

        return { success: true, message: "Ticket Raised Successfully" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Ticket not raised!" };
    }
};

export const getFeedbacksLogic = async () => {
    try {
        let [rows] = await pool.query(`SELECT * FROM support;`);

        return { success: true, message: "Feedbacks Fetched Successfully", data: rows };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Feedbacks not fetched!" };
    }
}