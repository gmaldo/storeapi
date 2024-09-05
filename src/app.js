import express from "express"
import PersistenceManager from "./PersistenceManager.js"
import productRouter from "./routes/products.router.js"
import viewRouter from "./routes/views.router.js"
import cartsRouter from "./routes/carts.router.js"
import { Server } from "socket.io"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"


const manager = new PersistenceManager()
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/api", productRouter)
app.use("/api", cartsRouter)
app.use('/products',viewRouter)



const port = parseInt(process.env.PORT) || 8080;


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})