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
    manager.readProducts()
    .then(products => {
        socket.emit('products', products)
    })
    .catch(error => {
        console.log(error)
    })
      
    socket.on('crearProducto', (data) => {
        //console.log('Recieved data', data);
        //guardar producto en el archivo
        manager.writeNewProduct({ ...data, thumbnails: [] })
        .then(product => {
            //console.log(product)
            //use socket server porque si habia 2 ventanas no se mostraba de las 2 asi que necesito que sea eliminado de todos los clientes conectados, la otra era que agrege el producto de manera local y luego un emmit broadcat 
            socketServer.emit('productoCreado', product);
        })
        .catch(error => {
            console.log(error)
        })
    })
    socket.on('deleteProduct', (id) => {
        console.log('eliminando producto', id)
        manager.deleteProduct(id)
        .then(deleted=>{
            if(deleted){
                //idem para crear
                socketServer.emit('confirmDelete', id)
            }
        })
        .catch(error => {
            console.log(error)
        })
    })

})