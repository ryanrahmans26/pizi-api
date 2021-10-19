import { Router } from "express";
const post = require('../controllers/post.controller')
const router = Router()
const verifyToken = require('../middleware/auth')
import uploadFile from "../middleware/upload"


router.get("/", verifyToken, post.getAllPost)

router.get("/:id", verifyToken, post.getPost)

router.post("/", verifyToken, uploadFile, post.createPost)

router.put("/:id", verifyToken, uploadFile, post.updatePost)

router.delete("/:id", verifyToken, post.deletePost)


export default router