import express from "express";
import { inviteUser } from "../controllers/user_managemnt_controller/user.js";
import userSignup from "../controllers/user_managemnt_controller/signup.js";
import userTokenVerify from "../middlewares/user_management/userTokenVerify.js";
import userLogin from "../controllers/user_managemnt_controller/login.js";
import getMe from "../controllers/user_managemnt_controller/getUser.js";
import fetchAllUsers from "../controllers/user_managemnt_controller/allUsers.usermanagement.js";
import signupAccess from "../middlewares/user_management/signup.middleware.js";
import authenticateToken from "../middlewares/routesProtection.js";
import updatesUsers from "../controllers/user_managemnt_controller/updateUsers.controllers.js";
import forgotPassword from "../controllers/user_managemnt_controller/forgotPassword.js";
import resetPassword from "../controllers/user_managemnt_controller/resetPassword.js";
const router = express.Router();

<<<<<<< HEAD
router
.get("/me", authenticateToken, getMe)
.get("/allUsers",authenticateToken, fetchAllUsers)
.post("/invite_user", authenticateToken,inviteUser)
.post("/signupData/:token", userTokenVerify, signupAccess, userSignup)
.post("/login", userLogin)
.post("/forgotPassword", forgotPassword)
.post("/resetPassword", resetPassword)
.put("/updateUser/:id",authenticateToken,updatesUsers)

.post("/logout", authenticateToken, (req, res) => {
=======
router.get("/me", authenticateToken, getMe);
router.post("/invite_user", authenticateToken,inviteUser);
router.post("/signupData/:token", userTokenVerify, signupAccess, userSignup);
router.post("/login", userLogin);
router.get("/allUsers",authenticateToken, fetchAllUsers);
router.put("/updateUser/:id",authenticateToken,updatesUsers)
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", authenticateToken, (req, res) => {
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    // console.log("eeee", res);
  return res.json({ Logout: true });
});

export default router;
