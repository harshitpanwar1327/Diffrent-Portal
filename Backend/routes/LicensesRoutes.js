import express from 'express';
import {generateLicense, getLicense, deleteLicense, validateLicense, activateLicense, getLicenseById} from '../controllers/LicenseControllers.js';

const router = express.Router();

//Admin Routes
router.post('/generate', generateLicense);
router.get("/get-licenses", getLicense);

//Portal Routes
router.post('/validate', validateLicense);
router.post("/activate-license", activateLicense);
router.get("/get-license", getLicenseById);
router.delete("/delete-license/:id", deleteLicense);

export default router;