import express from 'express';
import { updatePolicy, getPolicy } from '../controllers/PolicyControllers.js';

const router = express.Router();

router.post("/update-policy", updatePolicy);
router.get("/get-policy/:groupId", getPolicy);

export default router;