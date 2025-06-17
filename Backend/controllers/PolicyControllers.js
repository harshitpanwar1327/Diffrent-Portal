import { GroupDetails, PolicyDetails } from "../models/PolicyModels.js";
import { addGroupLogic, getGroupLogic, getGroupByIdLogic, updateGroupLogic, deleteGroupLogic, updatePolicyLogic, getPolicyLogic } from "../services/PolicyServices.js";

export const addGroup = async (req, res) => {
    const { groupID, groupName } = req.body;

    if (!groupID || !groupName) {
        return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    const groupData = new GroupDetails({ groupID, groupName });

    try {
        const response = await addGroupLogic(groupData);
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

export const getGroup = async (req, res) => {
    try {
        const result = await getGroupLogic();
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

export const getGroupById = async (req, res) => {
    let {groupID} = req.params;
    
    try {
        const result = await getGroupByIdLogic(groupID);
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

export const updateGroup = async (req, res) => {
    let {groupID, groupName} = req.body;

    if (!groupID || !groupName) {
        return res.status(400).json({success: false, message: "All fields not filled!"});
    }

    const groupData = new GroupDetails({ groupID, groupName });

    try {
        const response = await updateGroupLogic(groupData);
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
        let response = await deleteGroupLogic(groupID);
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
        const response = await updatePolicyLogic(policyData);
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

export const getPolicy = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "GroupID not found!"})
    }

    try {
        let response = await getPolicyLogic(groupID);
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