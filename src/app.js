import express from "express"
import PersistenceManager from "./PersistenceManager.js"
import productRouter from "./routes/products.router.js"
import viewRouter from "./routes/views.router.js"
import cartsRouter from "./routes/carts.router.js"
import { Server } from "socket.io"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import * as socket from 'socket.io'


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
app.use('/',viewRouter)



const port = parseInt(process.env.PORT) || 8080;


const httpServer = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")
    socket.on('message', data => {
        console.log(data)
    })
    socket.on('crearProducto', (data) => {
        console.log('Datos del producto recibidos:', data);
        //guardar producto en el archivo
        
        //enviar producto guardado con el id
        socket.emit('productoCreado', data);
    })

})