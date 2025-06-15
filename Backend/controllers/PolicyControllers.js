import { GroupDetails, PolicyDetails } from "../models/PolicyModels.js";
import { insertGroupData, getGroupData, getGroupByID, updateGroupData, deleteGroupData, updatePolicyData, fetchPolicyData } from "../services/PolicyServices.js";

export const groupDetail = async (req, res) => {
    const { groupID, groupName } = req.body;

    if (!groupID || !groupName) {
        return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    const groupData = new GroupDetails({ groupID, groupName });

    try {
        const response = await insertGroupData(groupData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const fetchGroupDetails = async (req, res) => {
    try {
        const result = await getGroupData();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const fetchGroupDetailsByID = async (req, res) => {
    let {groupID} = req.params;
    
    try {
        const result = await getGroupByID(groupID);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateGroupDetails = async (req, res) => {
    let {groupID, groupName} = req.body;

    if (!groupID || !groupName) {
        return res.status(400).json({success: false, message: "All fields not filled!"});
    }

    const groupData = new GroupDetails({ groupID, groupName });

    try {
        const response = await updateGroupData(groupData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteGroup = async (req, res) => {
    let {groupID} = req.params;
    
    if(!groupID) {
        return res.status(400).json({success: false, message: "Element not found."});
    }

    try {
        let response = await deleteGroupData(groupID);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updatePolicy = async (req,res) => {
    const {groupID, usb, mtp, printing, browserUpload, bluetooth} = req.body;

    const policyData = new PolicyDetails({groupID, usb, mtp, printing, browserUpload, bluetooth});

    try {
        const response = await updatePolicyData(policyData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const fetchPolicyDetails = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "GroupID not found!"})
    }

    try {
        let response = await fetchPolicyData(groupID);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}