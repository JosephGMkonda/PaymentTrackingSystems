import express from "express"
import {registerUser, Login} from "../controller/AuthenticationController.js"

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", Login);

export default AuthRouter;


