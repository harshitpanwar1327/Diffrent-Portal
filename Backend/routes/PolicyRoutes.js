import express from 'express';
import { addGroup, getGroup, getGroupById, updateGroup, deleteGroup, updatePolicy, getPolicy } from '../controllers/PolicyControllers.js';

const router = express.Router();

router.post("/add-group", addGroup);
router.get("/get-group", getGroup);
router.get("/get-group/:groupId", getGroupById);
router.put("/update-group", updateGroup);
router.delete("/delete-group/:groupId", deleteGroup);

router.post("/update-policy", updatePolicy);
router.get("/get-policy/:groupId", getPolicy);

export default router;