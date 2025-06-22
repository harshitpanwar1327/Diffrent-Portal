import {registerLogic, loginLogic} from '../services/AdminServices.js'

export const register = async (req, res) => {
    let {name, email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Fill all the required fields!"});
    }

    try {
        let response = await registerLogic(name, email, password);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({success: false, message: "Internal server error!"});
    }
}

export const login = async (req, res) => {
    let {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Fill all the required fields!"});
    }

    try {
        let response = await loginLogic(email, password);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({success: false, message: "Internal server error!"});
    }
}