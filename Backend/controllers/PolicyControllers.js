import { PolicyDetails } from "../models/PolicyModels.js";
import { updatePolicyLogic, getPolicyLogic } from "../services/PolicyServices.js";

export const updatePolicy = async (req,res) => {
    const {groupId, usb, mtp, printing, browserUpload, bluetooth, clipboard, blockedApps} = req.body;

    const policyData = new PolicyDetails({groupId, usb, mtp, printing, browserUpload, bluetooth, clipboard, blockedApps});

    try {
        const response = await updatePolicyLogic(policyData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

export const getPolicy = async (req, res) => {
    let {groupId} = req.params;

    if(!groupId) {
        return res.status(400).json({success: false, message: "GroupID not found!"})
    }

    try {
        let response = await getPolicyLogic(groupId);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}