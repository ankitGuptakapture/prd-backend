import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const chatGpt = new OpenAI({
    apiKey: process.env.API_KEY,
})
export default chatGpt