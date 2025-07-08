import express from "express";
import registerClientController from "../controllers/registerClientController.js";

const router = express.Router();

router.post("/register", registerClientController.register);

router.post("/verify-email", registerClientController.verifyCodeEmail);

export default router;
