import { Router } from "express";
const verifyToken = require('../middleware/auth')
const user = require('../controllers/user.controller')
const router = Router()


router.get("/", verifyToken, user.getAllUser)

router.get("/:id", verifyToken, user.getUser)

router.post("/", user.createUser)

router.put("/:id", verifyToken, user.updateUser)

router.delete("/:id", verifyToken, user.deleteUser)


export default router