import {UsersModels} from '../models/UsersModels.js'
import {registerLogic, loginLogic} from '../services/UsersService.js';

export const register = async (req, res) => {
    let {email, password, organization} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: "Fill all the required fields"});
    }

    let registerData = new UsersModels({email, password, organization});

    try {
        let response = await registerLogic(registerData);
        if(response.success){
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    let {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Email or password not found"});
    }

    const userData = new UsersModels({email, password});

    try {
        let response = await loginLogic(userData);
        if(response.success){
            return res.status(200).json(response);
        } else{
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}