import express from 'express';
import {generateLicense, getLicense, deleteLicense, validateLicense, activateLicense, getLicenseById} from '../controllers/LicenseControllers.js';

const router = express.Router();

//Admin Routes
router.post('/generate', generateLicense);
router.get("/get-licenses", getLicense);
router.delete("/delete-license/:id", deleteLicense);

//Portal Routes
router.post('/validate', validateLicense);
router.post("/activate-license", activateLicense);
router.get("/get-license", getLicenseById);

export default router;