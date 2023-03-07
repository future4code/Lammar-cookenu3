import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AddressInfo } from 'net';
import { userRouter } from "./routes/user"

dotenv.config()

export const setup = async () => {
    const app = express()
    app.use(express.json())
    app.use(cors())

    app.use("/user", userRouter)

    const server = app.listen(process.env.PORT || 3003, () => {
        if (server) {
            const address = server.address() as AddressInfo
            console.log(`🚀  Server is running in http://localhost:${address.port}`)
        } else {
            console.error(`Failure upon starting server.`)
        }
    })
}