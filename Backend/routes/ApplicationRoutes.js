import express from 'express';
import { insertDevice } from '../controllers/ApplicationControllers.js';

const router = express.Router();

router.post('/get_ini', insertDevice);

export default router;