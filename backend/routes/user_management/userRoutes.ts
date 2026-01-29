import express from "express";
import { inviteUser } from "../../controllers/user_managemnt_controller/user";
import userSignup from "../../controllers/user_managemnt_controller/signup";
import userTokenVerify from "../../middlewares/user_management/userTokenVerify";
import userLogin from "../../controllers/user_managemnt_controller/login";

const router = express.Router();
console.log("user routes 2");

router.post("/invite_user", inviteUser);
router.post("/signupData/:token", userTokenVerify, userSignup);
router.post("/login",userLogin)


export default router;
