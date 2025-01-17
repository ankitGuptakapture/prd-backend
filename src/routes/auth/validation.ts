import { body, } from "express-validator"

export const loginRules = () => {
    return [
        body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Please enter valid email address"),
        body("password").trim().notEmpty()
    ]
}


export const registerRules = () => {
    return [
        body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Please enter valid email address"),
        body("password").trim().notEmpty(),
        body("name").trim().notEmpty()
    ]
}