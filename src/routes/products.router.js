import express from "express"
import PersistenceManager from "../PersistenceManager.js"

const router = express.Router()

const manager = new PersistenceManager()

router.get('/products/', (req, res) => {
    manager.readProducts()
    .then(products => {
        let limit = parseInt(req.query.limit) || products.length
        res.json(products.slice(0, limit))
    })
    .catch(error => {
        res.status(501).json(error)
    })
})

router.get('/products/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    manager.getProductById(id)
    .then(product => {
        if (product) {
            res.json(product)
        } else {
            res.status(400).json({ error: "Producto no encontrado" })
        }
    })
    .catch(error => {
        res.status(501).json({error:"error"})
    })
})

router.post('/products/', (req, res) => {
    const { title, description, code, price, stock, category, status } = req.body;  
    let errors = [];

    if (!title) {
        errors.push("El campo 'title' es obligatorio.");
    }
    if (!description) {
        errors.push("El campo 'description' es obligatorio.");
    }
    if (!code) {
        errors.push("El campo 'code' es obligatorio.");
    }
    if (price === undefined) {
        errors.push("El campo 'price' es obligatorio.");
    } else if (typeof price !== 'number') {
        errors.push("El campo 'price' debe ser un número.");
    }
    if (stock === undefined) {
        errors.push("El campo 'stock' es obligatorio.");
    } else if (typeof stock !== 'number') {
        errors.push("El campo 'stock' debe ser un número.");
    }
    if (!category) {
        errors.push("El campo 'category' es obligatorio.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const productStatus = status !== undefined ? status : true;

    const newProduct = {
        title,
        description,
        code,
        price,
        stock,
        category,
        status: productStatus,
        thumbnails: req.body.thumbnails || []
    }
    
    manager.writeNewProduct(newProduct)
    .then(product => {
        res.status(201).json(product)
    })
    .catch(error => {
        res.status(501).json({error:"error en el servidor al guardar nuevo producto"})
    })
})
router.put('/products/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    let updatedProduct
    manager.getProductById(id)
    .then(product => {
        if (product) {
            const { title, description, code, price, stock, category, status } = req.body;
            product.title = title || product.title;
            product.description = description || product.description;
            product.code = code || product.code;
            product.price = price || product.price;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            product.status = status !== undefined ? status : product.status;
            product.thumbnails = req.body.thumbnails || product.thumbnails;
            console.log(product)
            manager.updateProduct(product)
            .then(updatedProduct => {
                console.log(updatedProduct)
                res.status(200).json(updatedProduct)
            }).catch(error => {
                res.status(501).json({error:"error al actualizar el producto en el Servidor"})
            })  
        } else {
            res.status(400).json({ error: "Producto no encontrado" })
        }
    })
    .catch(error => {
        res.status(501).json({error:"error al obtener el producto del archivo"})
    })
})

router.delete('/products/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    manager.deleteProduct(id)
    .then(deleted => {
        if (deleted) {
            res.json({ message: "Producto eliminado" })
        } else {
            res.status(400).json({ error: "Producto no encontrado" })
        }
    })
    .catch(error => {
        res.status(501).json({error:"error al eliminar el producto del archivo"})
    })
})

//module.exports = router
export default router