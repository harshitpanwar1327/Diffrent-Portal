import { pool } from '../config/Database.js';

export const ticketDetailsLogic = async (supportData) => {
    try {
        const query = `INSERT INTO Support (ticketID, groupID, deviceId, issueType, 
        description, screenshot, urgency) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [ 
            supportData.ticketId, 
            supportData.groupId, 
            supportData.deviceId, 
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

export const updateStatusLogic = async (status, ticketId) => {
    try {
        let query = `UPDATE support SET status = ? WHERE ticketId = ?`;
        let values = [status, ticketId];
        await pool.query(query, values);

        return { success: true, message: "Status updated successfully" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Status not updated!" };
    }
}

export const getFeedbacksLogic = async (limit, offset, search) => {
    let searchQuery = `%${search}%`;

    try {
        let [rows] = await pool.query(`SELECT * FROM support WHERE deviceId LIKE ? OR issueType LIKE ? OR urgency LIKE ? LIMIT ? OFFSET ?;`, [searchQuery, searchQuery, searchQuery, limit, offset]);
        let [columnRows] = await pool.query(`SELECT COUNT(*) AS total FROM support WHERE deviceId LIKE ? OR issueType LIKE ? OR urgency LIKE ?;`, [searchQuery, searchQuery, searchQuery]);
        let total = columnRows[0].total;

        return { success: true, message: "Feedbacks Fetched Successfully", data: rows, total };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Feedbacks not fetched!" };
    }
}