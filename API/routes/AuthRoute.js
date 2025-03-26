import express from "express"
import {registerUser, Login, checkAuth} from "../controller/AuthenticationController.js"
import {authMiddleware} from "../middlewares/AuthenticationMiddleware.js"
 
const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", Login);
AuthRouter.get('/check-auth', authMiddleware, checkAuth);

export default AuthRouter;


