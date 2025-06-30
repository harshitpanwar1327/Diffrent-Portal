import express from 'express';
import {ticketDetails, getTickets, getFeedbacks, updateStatus} from '../controllers/SupportControllers.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
  
const upload = multer({ storage: storage })

//Portal Routes
router.post('/raise-ticket', upload.single('screenshot'), ticketDetails);
router.post('/get-tickets', getTickets);

//Admin Routes
router.get('/get-feedback', getFeedbacks);
router.put('/status', updateStatus);

export default router;