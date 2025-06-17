import {pool} from '../config/Database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerLogic = async (registerData) => {
    try {
        let hashedPassword = await bcrypt.hash(registerData.password, 10);
        let query = `INSERT INTO users(email, password, organization) VALUE(?,?,?)`;
        let values = [registerData.email, hashedPassword, registerData.organization];
        
        await pool.query(query, values);

        return {success: true, message: "User registered successfully."}
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not registered."}
    }
}

export const loginLogic = async (email, password) => {
    try {
        let [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if(rows.length===0) {
            return {success: false, message: "User not found."}
        }

        let passwordCompare = await bcrypt.compare(password, rows[0].password);
        if(!passwordCompare) {
            return {success: false, message: "Password not match."};
        }

        let token = jwt.sign(
            {id: rows[0].id, email: rows[0].email},
            process.env.JWT_SECRET,
            {'expiresIn': '3h'}
        );

        return {success: true, message: "User login successfully", data: token};
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not found."};
    }
}