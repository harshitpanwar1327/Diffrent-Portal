import express from 'express'
import {getHealth} from '../controllers/HealthControllers.js'

let router = express.Router();

router.get('/devices', getHealth);

export default router;