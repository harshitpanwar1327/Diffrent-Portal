import express from 'express';
import { addGroup, getGroup, getGroupById, updateGroup, deleteGroup, updatePolicy, getPolicy } from '../controllers/PolicyControllers.js';

const router = express.Router();

router.post("/add-group", addGroup);
router.get("/get-group", getGroup);
router.get("/get-group/:groupID", getGroupById);
router.put("/update-group", updateGroup);
router.delete("/delete-group/:groupID", deleteGroup);

router.post("/update-policy", updatePolicy);
router.get("/get-policy/:groupID", getPolicy);

export default router;