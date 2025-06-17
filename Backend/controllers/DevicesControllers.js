import { DevicesModels } from "../models/DevicesModels.js";
import {getDevicesLogic, getDevicesByGroupLogic, manageDeviceGroupLogic, deviceCountLogic, updateDeviceGroupLogic, updateDeviceLicenseLogic, deallocateLicenseLogic, deleteDeviceLogic} from "../services/DevicesServices.js";

export const getDevices = async (req, res) => {
    try {
        const result = await getDevicesLogic();
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getDevicesByGroup = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "Group not found."});
    }

    try {
        let response = await getDevicesByGroupLogic(groupID);
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

export const manageDeviceGroup = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "Group not found."});
    }

    try {
        let response = await manageDeviceGroupLogic(groupID);
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

export const deviceCount = async (req, res) => {
    try {
        let response = await deviceCountLogic();
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

export const updateDeviceGroup = async (req, res) => {
    let {macAddress, groupID} = req.body;

    if(!macAddress) {
        return res.status(400).json({success: false, message:"MAC Address not found."});
    }

    let deviceData = new DevicesModels({macAddress, groupID});

    try {
        let response = await updateDeviceGroupLogic(deviceData);
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
        console.error("Error saving configuration:", error);
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
        console.error("Error saving configuration:", error);
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
        console.error("Error saving configuration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}