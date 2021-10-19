import { Router } from "express";
const auth = require('../controllers/auth.controller')
const router = Router()

router.post("/login", auth.login)

export default router