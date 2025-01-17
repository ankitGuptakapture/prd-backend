import { Request,Response } from "express";
import chatGpt from "../../OpenAi";
export const handleUserPropmts = async (req:Request,res:Response) => {
  try {
    const {prompt }:{prompt:string} = req.body
    const resp = await chatGpt.chat.completions.create({
        model: "gpt-4o",
        messages: [{role: "user", content: prompt}],
    })
    return res.status(200).json({data:resp,message:"Successs"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
};
