import express from "express"
import PersistenceManager from "../PersistenceManager.js"

const manager = new PersistenceManager()
const router = express.Router()

router.get('/', (req, res) => {
    manager.readProducts()
    .then(products => {
        res.render('home', { products })
    })
    .catch(error => {
        res.status(501).json(error)
    })
})
export default router