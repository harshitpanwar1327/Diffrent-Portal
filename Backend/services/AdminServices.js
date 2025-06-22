import {adminModel} from '../models/AdminModels.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerLogic = async (name, email, password) => {
    try {
        const user = await adminModel.findOne({email});
        if(!!user) {
            return {success: false, message: "Email already exists!"};
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const userData = new adminModel({name, email, password: hashed_password});
        await userData.save();
        
        return {success: true, message: "User registered successfully"}
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not registered!"};
    }
}

export const loginLogic = async (email, password) => {
    try {
        const user = await adminModel.findOne({email});
        if(!user) {
            return {success: false, message: "User not exists!"};
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) {
            return {success: false, message: "Password not matched!"};
        }

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {'expiresIn': '3h'}
        );

        return {success: true, message: "User login successfully", token}
    } catch (error) {
        console.log(error);
        return {success: false, message: "User not logged in!"};
    }
}