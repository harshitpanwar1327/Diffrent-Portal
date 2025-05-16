import express from 'express';
import { configDetails, fetchConfig } from '../controllers/ConfigControllers.js';

const router = express.Router();

router.put('/edit-config', configDetails);
router.get('/get-config/:groupID', fetchConfig);

export default router;