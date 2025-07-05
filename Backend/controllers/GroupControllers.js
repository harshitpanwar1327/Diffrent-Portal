import { GroupDetails } from "../models/GroupModels.js";
import { addGroupLogic, getGroupLogic, getAllGroupLogic, getGroupByIdLogic, updateGroupLogic, deleteGroupLogic } from "../services/GroupServices.js";

export const addGroup = async (req, res) => {
    const { groupName } = req.body;

    if (!groupName) {
        return res.status(400).json({ success: false, message: "Fill all the required fields!" });
    }

    const groupData = new GroupDetails({ groupName });

    try {
        const response = await addGroupLogic(groupData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

export const getGroup = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let offset = (page - 1) * limit;

    try {
        const response = await getGroupLogic(limit, offset, search);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const getAllGroup = async (req, res) => {
    try {
        const response = await getAllGroupLogic();
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const getGroupById = async (req, res) => {
    let {groupId} = req.params;
    
    try {
        const result = await getGroupByIdLogic(groupId);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const updateGroup = async (req, res) => {
    let {groupId, groupName} = req.body;

    if (!groupId || !groupName) {
        return res.status(400).json({success: false, message: "Fill all the required fields!"});
    }

    const groupData = new GroupDetails({ groupId, groupName });

    try {
        const response = await updateGroupLogic(groupData);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const deleteGroup = async (req, res) => {
    let {groupId} = req.params;
    
    if(!groupId) {
        return res.status(400).json({success: false, message: "GroupId not found!"});
    }

    try {
        let response = await deleteGroupLogic(groupId);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}