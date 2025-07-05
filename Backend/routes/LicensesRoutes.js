import express from 'express';
import {generateLicense, getLicense, validateLicense, activateLicense, getAllLicense, deleteLicense} from '../controllers/LicenseControllers.js';

const router = express.Router();

//Admin Routes
router.post('/generate', generateLicense);

//Portal Routes
router.post('/validate', validateLicense);
router.post("/activate-license", activateLicense);
router.get("/all-license/:id", getAllLicense);
router.delete("/delete-license/:id", deleteLicense);

//Common Routes
router.get("/get-licenses", getLicense);

export default router;