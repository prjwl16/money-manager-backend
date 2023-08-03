import 'dotenv/config'
import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import morgan from "morgan" //for printing API logs
import {default as axios} from "axios"
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger.js"


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

app.post("/callback/whatsapp", async (req, res) => {
    console.log("Here: ", req.body)
    let json
    let total
    try {
        const prompt = req.body.Body
        json = await getExpenseJsonFromNatualLanguage(prompt)
    } catch (e) {
        console.log("Error converting body: ", e)
        if (e == "AI")
            return res.send("Failed to add transaction, please try again.")
        else if (e == "Error: user") return res.send("User not registered")
        return res.send("failed to capture body")
    }

    //Add transaction to transaction table
    //Create user if not exists
    const phone = req.body.WaId
    const name = req.body.ProfileName
    let user = await prisma.user.findUnique({where:{phone}})
    if (!user) {
        user = await prisma.user.create({data: {phone, name}})
        if (!user) return
    }
    //add transaction
    json = JSON.parse(json)
    let transaction = {
        action: json.action,
        amount: json.amount || 0,
        currency: json.currency || "INR",
        particular: json.particular || "transaction name",
        phone: phone,
    }
    console.log("Here: ", json.amount);
    if(transaction.amount == 0 )
        return res.sendStatus(400);
    if (transaction.action == "expense") transaction.amount = -transaction.amount
    try{
    let transactionObject = await prisma.transaction.create({data: transaction})
    console.log("Here: ", transactionObject);
    if (!transactionObject) console.log("Failed to add transaction")
    }catch (e){
        console.log("HerEr: ", e);
    }

    return res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})
