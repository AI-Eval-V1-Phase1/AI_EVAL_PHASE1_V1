"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../../controllers/user_managemnt_controller/user");
const signup_1 = __importDefault(require("../../controllers/user_managemnt_controller/signup"));
const userTokenVerify_1 = __importDefault(require("../../middlewares/user_management/userTokenVerify"));
const login_1 = __importDefault(require("../../controllers/user_managemnt_controller/login"));
const router = express_1.default.Router();
console.log("user routes 2");
router.post("/invite_user", user_1.inviteUser);
router.post("/signupData/:token", userTokenVerify_1.default, signup_1.default);
router.post("/login", login_1.default);
exports.default = router;
