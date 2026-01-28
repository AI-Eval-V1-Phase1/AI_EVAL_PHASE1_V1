import express from "express";
import { inviteUser } from "../../controllers/user_managemnt_controller/user";

const router = express.Router();

router.post("/invite_user", inviteUser);

export default router;

