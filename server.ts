import 'dotenv/config'
import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import morgan from "morgan" //for printing API logs
import {default as axios} from "axios"
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger.js"
import * as process from "process";

//Add logger
// @ts-ignore
global.logger  = logger;

//Initiate express app
const app = express()
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

//Add middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))

//Test route
app.get("/", async (_req, res) => {
    return res.send({success: true, message: "hooray.... it's working bruh"})
})
const prisma = new PrismaClient();

console.log("Here: ", process.env.NODE_ENV);

const getExpenseJsonFromNatualLanguage = async (prompt: string) => {
    const data = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `Assume you are adding expenses in your Database. Now, provide me json of this format {action:"expense or income", date: get it from sentence if not present then give today\'s ", amount:(number), currency: (INR, if not mentioned in sentence) }. from following sentence:  ${prompt}`,
            },
        ],
        temperature: 0.4,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GPT_TOKEN}`,
        },
        data: data,
    }

    const response = await axios.request(config)
    try {
        if (response) {
            return response.data.choices[0].message.content
        }
    } catch (e) {
        console.log("Error: ", e)
        throw new Error("Error converting text to JSON")
    }
}


app.listen(port, () => {
    console.log(`App listening on ${port}`)
})
