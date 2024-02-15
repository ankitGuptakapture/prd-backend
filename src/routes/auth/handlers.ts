import type { Request, Response } from "express"
import db from "../../drizzle"
import users from "../../models/User"
import { hash, compare } from "bcrypt"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm"
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password,name } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ ...errors.mapped() })
        }
        const hashed = await hash(password, 10)
        const user = await db.insert(users).values({
            email,
            password: hashed,
            name
        }).returning()
        const token = jwt.sign({
            data: { email,id:user[0].id }
        }, process.env.SECRET_KEY!, { expiresIn: '7d' })
        const userWithToken = { ...user[0], token }
        return res.status(200).send({ data: userWithToken, success: true })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: "something went wrong" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ ...errors.mapped() })
        }
        const findUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if (!findUser) {
            return res.status(422).send({ message: "user not found" })
        }
        const checkPassword = await compare(password,findUser.password)

        if (!checkPassword) {
            return res.status(422).send({ message: "please check your email and password" })
        }

        const token = jwt.sign({
            data: { email,id:findUser.id  }
        }, process.env.SECRET_KEY!, { expiresIn: '7d' })

        return res.status(200).send({ data: { ...findUser, token }, success: true })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: "something went wrong" })
    }
}