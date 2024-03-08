import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || req.headers.Authorization) as string
    if (!token) {
        return res.status(401).send({ message: "token is required" })
    }
    const verifyToken = token.replace("Bearer ", "")
    try {
        const user = jwt.verify(verifyToken, process.env.SECRET_KEY!) as {data:{email: string,id:number}}
        
        if (!user) {
            return res.status(401).send({ message: "token not valid" })
        } else {
            req.decoded = user.data
            next()
        }
    } catch (error) {
        return res.status(500).send({ message: "token not valid", error })
    }

}