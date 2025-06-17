import express from 'express';
import {generateLicense, validateLicense, activateLicense, getLicense} from '../controllers/LicenseControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/generate', generateLicense);

router.use(authMiddleware);

router.post('/validate', validateLicense);
router.post("/activate-license", activateLicense);
router.get("/get-license", getLicense);

export default router;