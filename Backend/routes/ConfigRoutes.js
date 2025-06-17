import express from 'express';
import { editConfig, getConfig } from '../controllers/ConfigControllers.js';

const router = express.Router();

router.put('/edit-config', editConfig);
router.get('/get-config/:groupId', getConfig);

export default router;