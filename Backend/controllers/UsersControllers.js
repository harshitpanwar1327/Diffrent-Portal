import {UsersModels} from '../models/UsersModels.js'
import {registerUser, loginUser} from '../services/UsersService.js';

export const register = async (req, res) => {
    let {email, password, organization} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: "All required fields are not filled."});
    }

    let registerData = new UsersModels({email, password, organization});

    try {
        let response = await registerUser(registerData);
        if(response.success){
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: "Something went wrong! Please try again."});
    }
}

export const login = async (req, res) => {
    let {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Email or password not found."});
    }

    try {
        let response = await loginUser(email, password);
        if(response.success){
            return res.status(200).json(response);
        } else{
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: "Something went wrong! Please try again."});
    }
}