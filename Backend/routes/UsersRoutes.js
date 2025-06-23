import express from 'express'
import {register, login, getUsers, deleteUser} from '../controllers/UsersControllers.js';

let router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-users", getUsers);
router.delete("/delete-user/:id", deleteUser);

export default router;