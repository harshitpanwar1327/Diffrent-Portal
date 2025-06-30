import express from 'express';
import { getDevices, getDevicesByGroup, getDevicesByHealth, manageDeviceGroup, deviceCount, updateDeviceGroup, updateDeviceLicense, deallocateLicense, deleteDevice } from '../controllers/DevicesControllers.js';

const router = express.Router();

router.get("/get-devices", getDevices);
router.get("/get-devices/:groupId", getDevicesByGroup);
router.get("/get-devices/:health", getDevicesByHealth);
router.get("/device-count", deviceCount);
router.post("/manage-group", manageDeviceGroup);
router.put("/update-group", updateDeviceGroup);
router.put("/update-license", updateDeviceLicense);
router.put("/deallocate-license/:macAddress", deallocateLicense);
router.delete("/delete-device/:macAddress", deleteDevice);

export default router;