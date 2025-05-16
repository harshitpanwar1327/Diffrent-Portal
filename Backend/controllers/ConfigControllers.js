import { ConfigModels } from "../models/ConfigModels.js";
import { insertConfigTable, getConfigData } from "../services/ConfigServices.js";

export const configDetails = async (req, res) => {
    let {id, organization, macAddress, ipAddress, date_enabled, tagline_enabled, layout, qr_top_left, qr_top_right, qr_bottom_left, qr_bottom_right, whitelist_processes} = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: "GroupID not found." });
    }

    let configData = new ConfigModels({id, organization, macAddress, ipAddress, date_enabled, tagline_enabled, layout, qr_top_left, qr_top_right, qr_bottom_left, qr_bottom_right, whitelist_processes});

    try {
        let response = await insertConfigTable(configData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Configuration not saved! Please try again." });
    }
};

export const fetchConfig = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "GroupID not found."});
    }

    try {
        let response = await getConfigData(groupID);
        if(response.success){
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: "Something went wrong! Please try again."})   
    }
}