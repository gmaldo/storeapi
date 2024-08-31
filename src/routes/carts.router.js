const express = require("express")
const router = express.Router()
const PersistenceManager = require("../PersistenceManager.js")

const manager = new PersistenceManager()

router.post('/carts', (req, res) => {
    manager.writeNewCart()
    .then(newCart => res.status(201).json(newCart))
    .catch(error => {
        res.status(501).json({error:"error al crear el carrito"})
    })
})
router.get('/carts/:cid', (req, res) => {
    let id = parseInt(req.params.cid)
    manager.readCarts().then(carts => {
        let cart = carts.find(cart => cart.id === id)
        if (cart) {
            res.status(200).json(cart.products)
        } else {
            res.status(400).json({ error: "Carrito no encontrado" })
        }
    })
})

router.post('/carts/:cid/product/:pid', (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    manager.getProductById(productId)
    .then(product => {
        if (product) {
            manager.getCartById(cartId)
            .then(cart => {
                if (cart) {
                    let cartProduct = cart.products.find(prod => prod.product === productId)
                    if (cartProduct) {
                        cartProduct.quantity++
                    } else {
                        cart.products.push({ product: productId, quantity: 1 })
                    }
                    manager.updateCart(cart)
                    .then(updatedCart => {
                        res.status(200).json(updatedCart)
                    })
                    .catch(error => {
                        res.status(501).json({error:"error al actualizar el carrito en el Servidor"})
                    })
                } else {
                    res.status(400).json({ error: "Carrito no encontrado" })
                }
            })
        } else {
            res.status(400).json({ error: "Producto no encontrado" })
        }
    })
    .catch(error => {
        res.status(501).json({error:"error al obtener el producto del archivo"})
    })
   
})
module.exports = router