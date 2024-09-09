import fs from "fs/promises"
class PersistenceManager {
    
    constructor() {
        this.productsFile = "products.json"
        this.cartsFile = "carts.json"
    }

    async readProducts() {
        try {
            const data = await fs.readFile(this.productsFile, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            console.log(error)
        }
    }
    //Generates an id
    async writeNewProduct(product) {
        try {
            
            const products = await this.readProducts()
            const timestamp = Date.now().toString();  // Marca de tiempo
            const randomNum = Math.floor(Math.random() * 10000).toString()
            const id = Number(timestamp + randomNum)
        
            const productWithId = { id, ...product }
            products.push(productWithId)
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
            return productWithId
        } catch (error) {
            console.log(error)
        }
    }
    
    async writeProducts(products) {
        try {
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
            return products
        } catch (error) {
            console.log(error)
        }
    }
    
    async getProductById(id) {
        try {
            const products = await this.readProducts()
            return products.find(p => p.id === id)
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(product) {
        try {
            const products = await this.readProducts()
            const index = products.findIndex(p => p.id === product.id)
            if (index !== -1) {
                products[index] = { ...products[index], ...product }
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
                return products[index]
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.readProducts()
            let index = products.findIndex(prod => prod.id === id)
            if (index !== -1) {
                products.splice(index, 1)
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2))
                return true
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.cartsFile, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            console.log(error)
        }
    }
    async writeCart(cart) {
        try {
            const carts = await this.readCarts()
            carts.push(cart)
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2))
            return cart
        } catch (error) {
            console.log(error)
        }
    }
    async writeNewCart() {
        try {
            const carts = await this.readCarts()
            const id = carts.length + 1
            const cart = { id, products: [] }
            carts.push(cart)
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2))
            return cart
        } catch (error) {
            console.log(error)
        }
    }
    async writeCarts(carts) {
        try {
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2))
            return carts
        } catch (error) {
            console.log(error)
        }
    }
    
    async getCartById(id) {
        try {
            const carts = await this.readCarts()
            return carts.find(c => c.id === id)
        } catch (error) {
            console.log(error)
        }
    }

    async updateCart(cart) {
        try {
            const carts = await this.readCarts()
            const index = carts.findIndex(c => c.id === cart.id)
            if (index !== -1) {
                carts[index] = { ...carts[index], ...cart }
                await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2))
                return carts[index]
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    } 
}
//module.exports = PersistenceManager
export default PersistenceManager