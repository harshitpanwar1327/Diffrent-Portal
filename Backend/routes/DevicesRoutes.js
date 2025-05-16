import express from 'express';
import { fetchDevices, fetchDevicesGroup, manageDevicesGroup, fetchDeviceCount, updateDeviceGroup, updateLicense, deallocateLicense, deleteDevice } from '../controllers/DevicesControllers.js';

const router = express.Router();

router.get("/fetch-devices", fetchDevices);
router.get("/fetch-by-group/:groupID", fetchDevicesGroup);
router.get("/manage-device-group/:groupID", manageDevicesGroup);
router.get("/device-count", fetchDeviceCount);
router.put("/update-group", updateDeviceGroup);
router.put("/update-license", updateLicense);
router.put("/deallocate-license/:macAddress", deallocateLicense);
router.delete("/delete-device/:macAddress", deleteDevice);

export default router;