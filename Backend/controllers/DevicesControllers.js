import { DevicesModels } from "../models/DevicesModels.js";
import {getDevicesData, getDevicesGroupData, manageDevicesGroupData, deviceCountData, updateDeviceGroupData, updateLicenseData, deallocateLicenseFromDevice, deleteDeviceData} from "../services/DevicesServices.js";

export const fetchDevices = async (req, res) => {
    try {
        const result = await getDevicesData();
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

export const fetchDevicesGroup = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "Group not found."});
    }

    try {
        let response = await getDevicesGroupData(groupID);
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

export const manageDevicesGroup = async (req, res) => {
    let {groupID} = req.params;

    if(!groupID) {
        return res.status(400).json({success: false, message: "Group not found."});
    }

    try {
        let response = await manageDevicesGroupData(groupID);
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

export const fetchDeviceCount = async (req, res) => {
    try {
        let response = await deviceCountData();
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
        let response = await updateDeviceGroupData(deviceData);
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

export const updateLicense = async (req, res) => {
    let {licenseKey, macAddress, deviceCount} = req.body;

    if(!licenseKey || !macAddress) {
        return res.status(400).json({success: false, message:"MAC Address not found."});
    }

    try {
        let response = await updateLicenseData(licenseKey, macAddress, deviceCount);
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
        let response = await deallocateLicenseFromDevice(macAddress);
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
        let response = await deleteDeviceData(macAddress);
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