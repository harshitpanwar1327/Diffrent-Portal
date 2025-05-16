import express from 'express';
import { groupDetail, fetchGroupDetails, fetchGroupDetailsByProduct, fetchGroupDetailsByID, updateGroupDetails, deleteGroup, updatePolicy, fetchPolicyDetails } from '../controllers/PolicyControllers.js';

const router = express.Router();

router.post("/add-group", groupDetail);
router.get("/fetch-group", fetchGroupDetails);
router.get("/fetch-by-product/:product", fetchGroupDetailsByProduct);
router.get("/fetch-by-groupID/:groupID", fetchGroupDetailsByID);
router.put("/update-group", updateGroupDetails);
router.delete("/delete-group/:groupID", deleteGroup);

router.post("/update-policy", updatePolicy);
router.get("/fetch-policy/:groupID", fetchPolicyDetails);

export default router;