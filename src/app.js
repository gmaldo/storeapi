import express from "express"
import PersistenceManager from "./PersistenceManager.js"
import productRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { Server } from "socket.io"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"


const manager = new PersistenceManager()
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", productRouter)
app.use("/api", cartsRouter)


const port = parseInt(process.env.PORT) || 8080;


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})