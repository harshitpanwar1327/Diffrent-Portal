import {pool} from '../config/Database.js'

export const getHealthLogic = async (limit, offset) => {
    try {
        let now = new Date();
        let healthyTime = new Date(now.getTime() - 3*24*60*60*1000);
        let retiredTime = new Date(now.getTime() - 30*24*60*60*1000);

        const [healthy] = await pool.query(`SELECT * FROM devices WHERE lastActive > ? LIMIT ? OFFSET ?;`, [healthyTime, limit, offset]);
        const [unknown] = await pool.query(`SELECT * FROM devices WHERE lastActive <= ? AND lastActive > ? LIMIT ? OFFSET ?;`, [healthyTime, retiredTime, limit, offset]);
        const [retired] = await pool.query(`SELECT * FROM devices WHERE lastActive <= ? LIMIT ? OFFSET ?;`, [retiredTime, limit, offset]);

        const [countHealthy] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE lastActive > ?;`, [healthyTime]);
        const totalHealthy = countHealthy[0].total;
        const [countUnknown] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE lastActive <= ? AND lastActive > ?;`, [healthyTime, retiredTime]);
        const totalUnknown = countUnknown[0].total;
        const [countRetired] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE lastActive <= ?;`, [retiredTime]);
        const totalRetired = countRetired[0].total;

        return {success: true, data: {healthy, unknown, retired}, total: {totalHealthy, totalUnknown, totalRetired}};
    } catch (error) {
        console.log(error);
        return {success: false, message: "Unable to fetch the health data!"};
    }
}

export const getHealthByGroupLogic = async (limit, offset, id) => {
    try {
        let now = new Date();
        let healthyTime = new Date(now.getTime() - 3*24*60*60*1000);
        let retiredTime = new Date(now.getTime() - 30*24*60*60*1000);

        const [healthy] = await pool.query(`SELECT * FROM devices WHERE groupId = ? AND lastActive > ? LIMIT ? OFFSET ?;`, [id, healthyTime, limit, offset]);
        const [unknown] = await pool.query(`SELECT * FROM devices WHERE groupId = ? AND lastActive <= ? AND lastActive > ? LIMIT ? OFFSET ?;`, [id, healthyTime, retiredTime, limit, offset]);
        const [retired] = await pool.query(`SELECT * FROM devices WHERE groupId = ? AND lastActive <= ? LIMIT ? OFFSET ?;`, [id, retiredTime, limit, offset]);

        const [countHealthy] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE groupId = ? AND lastActive > ?;`, [id, healthyTime]);
        const totalHealthy = countHealthy[0].total;
        const [countUnknown] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE groupId = ? AND lastActive <= ? AND lastActive > ?;`, [id, healthyTime, retiredTime]);
        const totalUnknown = countUnknown[0].total;
        const [countRetired] = await pool.query(`SELECT COUNT(*) AS total FROM devices WHERE groupId = ? AND lastActive <= ?;`, [id, retiredTime]);
        const totalRetired = countRetired[0].total;

        return {success: true, data: {healthy, unknown, retired}, total: {totalHealthy, totalUnknown, totalRetired}};
    } catch (error) {
        console.log(error);
        return {success: false, message: "Unable to fetch the health data group wise!"}
    }
}