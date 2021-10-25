import { Router } from "express";
const product = require('../controllers/product.controller')
const router = Router()
const verifyToken = require('../middleware/auth')
import uploadFile from "../middleware/upload"


router.get("/", verifyToken, product.getAllProduct)

router.get("/:id", verifyToken, product.getProduct)

router.post("/", verifyToken, uploadFile, product.createProduct)

router.put("/:id", verifyToken, uploadFile, product.updateProduct)

router.delete("/:id", verifyToken, product.deleteProduct)


export default router