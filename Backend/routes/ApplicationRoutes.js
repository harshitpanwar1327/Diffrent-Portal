import express from 'express';
import { insertDevice } from '../controllers/ApplicationControllers.js';

const router = express.Router();

router.post('/insert-device', insertDevice);

export default router;