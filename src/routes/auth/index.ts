import { Router } from "express";
import { login, register } from "./handlers";
import { loginRules, registerRules } from "./validation"
const routes = Router();


routes.post("/register", registerRules(), register)
routes.post("/login", loginRules(), login)



export default routes