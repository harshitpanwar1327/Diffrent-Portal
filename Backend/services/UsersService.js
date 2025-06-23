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
        return {success: false, message: "User not registered!"}
    }
}

export const loginLogic = async (userData) => {
    try {
        let [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [userData.email]);
        if(rows.length===0) {
            return {success: false, message: "User not found!"}
        }

        let passwordCompare = await bcrypt.compare(userData.password, rows[0].password);
        if(!passwordCompare) {
            return {success: false, message: "Password not match!"};
        }

        let token = jwt.sign(
            {id: rows[0].id, email: rows[0].email},
            process.env.JWT_SECRET,
            {'expiresIn': '3h'}
        );

        return {success: true, message: "User login successfully", token: token, userId: rows[0].id};
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not found!"};
    }
}

export const getUsersLogic = async () => {
    try {
        let [rows] = await pool.query(`SELECT * FROM users;`);

        return {success: true, message: "User fetched successfully", data: rows};
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not fetched!"};
    }
}

export const updateUserLogic = async (userData, id) => {
    try {
        let hashedPassword = await bcrypt.hash(userData.password, 10);
        let query = `UPDATE users SET email = ?, password = ?, organization = ? WHERE id = ?;`;
        let values = [userData.email, hashedPassword, userData.organization, id];
        await pool.query(query, values);

        return {success: true, message: "User updated successfully"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not updated!"};
    }
}

export const deleteUserLogic = async (id) => {
    try {
        let query = `DELETE FROM users WHERE id = ?`;
        let values = [id];
        await pool.query(query, values);

        return {success: true, message: "User deleted successfully"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not deleted!"};
    }
}