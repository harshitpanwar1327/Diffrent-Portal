import { getHealthLogic } from '../services/HealthServices.js'

export const getHealth = async (req, res) => {
    try {
        let response = await getHealthLogic();
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log("Error", error);
        return res.status(400).json({success: false, message: "Internal Server Error!"});
    }
}