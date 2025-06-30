import { DevicesModels } from "../models/DevicesModels.js";
import {getDevicesLogic, getDevicesByGroupLogic, getDevicesByHealthLogic, deviceCountLogic, manageDeviceGroupLogic, updateDeviceGroupLogic, updateDeviceLicenseLogic, deallocateLicenseLogic, deleteDeviceLogic} from "../services/DevicesServices.js";

export const getDevices = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let offset = (page - 1) * limit;

    try {
        const result = await getDevicesLogic(limit, offset, search);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

export const getDevicesByGroup = async (req, res) => {
    let {groupId} = req.params;

    if(!groupId) {
        return res.status(400).json({success: false, message: "Group not found!"});
    }

    try {
        let response = await getDevicesByGroupLogic(groupId);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const getDevicesByHealth = async (req, res) => {
    let {health} = req.params;

    try {
        let response = await getDevicesByHealthLogic(health);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const deviceCount = async (req, res) => {
    try {
        let response = await deviceCountLogic();
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
}

export const manageDeviceGroup = async (req, res) => {
    let page = req.body.page || 1;
    let limit = req.body.limit || 10;
    let offset = (page - 1) * limit;
    let search = req.body.search || '';
    let groupId = req.body.groupId;

    if(!groupId) {
        return res.status(400).json({success: false, message: "Group not found."});
    }

    try {
        let response = await manageDeviceGroupLogic(limit, offset, search, groupId);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateDeviceGroup = async (req, res) => {
    let {macAddress, groupId, groupName} = req.body;

    if(!macAddress) {
        return res.status(400).json({success: false, message:"MAC Address not found."});
    }

    let deviceData = new DevicesModels({macAddress, groupId, groupName});

    try {
        let response = await updateDeviceGroupLogic(deviceData);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const updateDeviceLicense = async (req, res) => {
    let {licenseKey, macAddress, deviceCount} = req.body;

    if(!licenseKey || !macAddress) {
        return res.status(400).json({success: false, message:"MAC Address not found."});
    }

    try {
        let response = await updateDeviceLicenseLogic(licenseKey, macAddress, deviceCount);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deallocateLicense = async (req, res) => {
    let {macAddress} = req.params;

    if(!macAddress) {
        return {success: false, message: "MAC Address not found!"};
    }

    try {
        let response = await deallocateLicenseLogic(macAddress);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const deleteDevice = async (req, res) => {
    let {macAddress} = req.params;

    if(!macAddress) {
        return res.status(400).json({success: false, message: "Device not found! Please try again."});
    }

    try {
        let response = await deleteDeviceLogic(macAddress);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}