import {pool} from '../config/Database.js'

export const getHealthLogic = async () => {
    try {
        let now = new Date();
        let healthyTime = new Date(now.getTime() - 3*24*60*60*1000);
        let retiredTime = new Date(now.getTime() - 30*24*60*60*1000);

        const [healthy] = await pool.query(`SELECT * FROM devices WHERE lastActive > ?;`, healthyTime);
        const [unknown] = await pool.query(`SELECT * FROM devices WHERE lastActive <= ? AND lastActive > ?;`, [healthyTime, retiredTime]);
        const [retired] = await pool.query(`SELECT * FROM devices WHERE lastActive <= ?;`, retiredTime);

        return {success: true, data: {healthy, unknown, retired}};
    } catch (error) {
        console.log(error);
        return {success: false, message: "Unable to fetch the health data!"};
    }
}