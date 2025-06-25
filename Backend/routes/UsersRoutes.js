import express from 'express'
import {register, login, getUsers, updateUser, deleteUser} from '../controllers/UsersControllers.js'
import {authMiddleware} from '../middlewares/AuthMiddleware.js'

let router = express.Router();

//Portal Routes
router.post("/login", login);

//Admin Routes
router.use(authMiddleware);

router.post("/register", register);
router.get("/get-users", getUsers);
router.put("/update-user/:id", updateUser)
router.delete("/delete-user/:id", deleteUser);

export default router;