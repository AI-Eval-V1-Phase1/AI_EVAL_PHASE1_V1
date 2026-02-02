import express from "express";
import { inviteUser } from "../controllers/user_managemnt_controller/user";
import userSignup from "../controllers/user_managemnt_controller/signup";
import userTokenVerify from "../middlewares/user_management/userTokenVerify";
import userLogin from "../controllers/user_managemnt_controller/login";
import fetchAllUsers from "../controllers/user_managemnt_controller/allUsers.usermanagement";
import signupAccess from "../middlewares/user_management/signup.middleware";
import authenticateToken from "../middlewares/routesProtection";
import updatesUsers from "../controllers/user_managemnt_controller/updateUsers.controllers";

const router = express.Router();

router.post("/invite_user", authenticateToken,inviteUser);
router.post("/signupData/:token", userTokenVerify, signupAccess, userSignup);
router.post("/login", userLogin);
router.get("/allUsers",authenticateToken, fetchAllUsers);
router.put("/updateUser/:id",authenticateToken,updatesUsers)
router.post("/logout", authenticateToken, (req, res) => {
    // console.log("eeee", res);
  return res.json({ Logout: true });
});

export default router;
