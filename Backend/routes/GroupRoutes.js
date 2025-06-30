import express from 'express';
import { addGroup, getGroup, getAllGroup, getGroupById, updateGroup, deleteGroup } from '../controllers/GroupControllers.js';

const router = express.Router();

router.post("/add-group", addGroup);
router.get("/get-group", getGroup);
router.get("/all-group/:userId", getAllGroup);
router.get("/get-group/:groupId", getGroupById);
router.put("/update-group", updateGroup);
router.delete("/delete-group/:groupId", deleteGroup);

export default router;