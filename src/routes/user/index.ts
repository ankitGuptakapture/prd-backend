import { Router } from "express"
import { findConnectedUsers, findUsers, getConnectUsers } from "./handlers"
import { checkToken } from "../../utils"


const route = Router()
route.get("/get-users", checkToken, findUsers)
route.get("/get-users-chat", checkToken, findConnectedUsers)
route.get("/connected-users",checkToken,getConnectUsers)
export default route