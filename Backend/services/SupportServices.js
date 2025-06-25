import { pool } from '../config/Database.js';

export const ticketDetailsLogic = async (supportData) => {
    try {
        const query = `INSERT INTO Support (userId, ticketID, groupID, deviceName, issueType, 
        description, screenshot, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ 
            supportData.userId,
            supportData.ticketId, 
            supportData.groupId, 
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

export const getFeedbacksLogic = async (limit, offset) => {
    try {
        let [rows] = await pool.query(`SELECT * FROM support LIMIT ? OFFSET ?;`, [limit, offset]);
        let [columnRows] = await pool.query(`SELECT COUNT(*) AS total FROM support;`);
        let total = columnRows[0].total;

        return { success: true, message: "Feedbacks Fetched Successfully", data: rows, total };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Feedbacks not fetched!" };
    }
}