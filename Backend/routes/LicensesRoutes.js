import express from 'express';
import {generateLicense, validateLicense, activeLicense, getLicense} from '../controllers/LicenseControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/generate', generateLicense);

router.use(authMiddleware);

router.post('/validate', validateLicense);
router.post("/active-license", activeLicense);
router.get("/get-license", getLicense);

export default router;