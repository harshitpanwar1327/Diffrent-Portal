import express from 'express'
import {register, login, getUsers, updateUser, deleteUser} from '../controllers/UsersControllers.js';

let router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-users", getUsers);
router.put("/update-user/:id", updateUser)
router.delete("/delete-user/:id", deleteUser);

export default router;