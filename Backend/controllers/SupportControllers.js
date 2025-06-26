import { SupportModels } from '../models/SupportModels.js';
import { ticketDetailsLogic, getFeedbacksLogic, updateStatusLogic } from "../services/SupportServices.js";

export const ticketDetails = async (req, res) => {
    let {userId, ticketId, groupId, deviceId, issueType, description, urgency} = req.body;
    let screenshot = req.file.filename;

    if(!userId || !ticketId || !groupId || !deviceName || !issueType || !description){
        return res.status(400).json({success: false, message: "All required fields are not filled."})
    }

    let supportData = new SupportModels({userId, ticketId, groupId, deviceId, issueType, description, screenshot, urgency});

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

export const getFeedbacks = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    let search = req.query.search || '';

    try {
        let response = await getFeedbacksLogic(limit, offset, search);
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

export const updateStatus = async (req, res) => {
    let {status, ticketId} = req.body;

    if(!status || !ticketId) {
        return res.status(400).json({success: false, message: "Status or ticketId is undefined"});
    }

    try {
        let response = await updateStatusLogic(status, ticketId);
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