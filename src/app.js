const express = require("express")
const PersistenceManager = require("./PersistenceManager.js")
const manager = new PersistenceManager()
const productRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", productRouter)
app.use("/api", cartsRouter)

const port = parseInt(process.env.PORT) || 8080;


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})