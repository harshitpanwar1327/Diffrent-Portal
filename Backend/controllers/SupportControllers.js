import { SupportModels } from '../models/SupportModels.js';
import { ticketDetailsLogic } from "../services/SupportServices.js";

export const ticketDetails = async (req, res) => {
    let {userId, ticketID, groupID, deviceName, issueType, description, urgency} = req.body;
    let screenshot = req.file.filename;

    if(!userId || !ticketID || !groupID || !deviceName || !issueType || !description){
        return res.status(400).json({success: false, message: "All required fields are not filled."})
    }

    let supportData = new SupportModels({userId, ticketID, groupID, deviceName, issueType, description, screenshot, urgency});

    try {
        let response = await ticketDetailsLogic(supportData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}