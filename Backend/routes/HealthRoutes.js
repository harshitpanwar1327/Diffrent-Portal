import express from 'express'
import {getHealth, getHealthByGroup} from '../controllers/HealthControllers.js'

let router = express.Router();

router.get('/devices', getHealth);
router.post('/devices', getHealthByGroup)

export default router;