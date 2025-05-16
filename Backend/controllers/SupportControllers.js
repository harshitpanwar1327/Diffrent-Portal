import { SupportModels } from '../models/SupportModels.js';
import { insertSupportData } from "../services/SupportServices.js";

export const supportDetail = async (req, res) => {
    let {ticketID, groupID, deviceName, issueType, description, urgency} = req.body;
    let screenshot = req.file.filename;

    if(!ticketID || !groupID || !deviceName || !issueType || !description){
        return res.status(400).json({success: false, message: "All required fields are not filled."})
    }

    let supportData = new SupportModels({ticketID, groupID, deviceName, issueType, description, screenshot, urgency});

    try {
        let response = await insertSupportData(supportData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving support ticket:", error);
        return res.status(500).json({ success: false, message: "Ticket not saved! Please try again." });
    }
}