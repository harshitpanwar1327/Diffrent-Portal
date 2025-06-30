import express from 'express';
import {generateLicense, getLicense, validateLicense, activateLicense, getLicenseById, getAllLicense, deleteLicense} from '../controllers/LicenseControllers.js';

const router = express.Router();

//Admin Routes
router.post('/generate', generateLicense);
router.get("/get-licenses", getLicense);

//Portal Routes
router.post('/validate', validateLicense);
router.post("/activate-license", activateLicense);
router.get("/get-license", getLicenseById);
router.get("/all-license/:id", getAllLicense);
router.delete("/delete-license/:id", deleteLicense);

export default router;