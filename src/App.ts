import express from "express"
import { teste } from "./logic"

const app = express()
app.get("/",teste)
app.listen(3000, ()=>('Server is running'))