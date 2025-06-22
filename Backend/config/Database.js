import dotenv from "dotenv";
import mysql2 from 'mysql2/promise';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Pass,
    database: process.env.DB_Name,
    connectionLimit: 10,
    queueLimit: 5,
    waitForConnections: true
});

const checkConnection = async () =>{
    try {
        const connection = await pool.getConnection();
        console.log("Database created sucessfully");
        connection.release();
    } catch (error) {
        console.log("Something Went Wrong! Database Connection Lost!", error);
    }
}

export {pool, checkConnection};