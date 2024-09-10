const socket = io()

const myForm = document.getElementById('myform')

function validateForm() {
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = document.getElementById('price').value
    const stock = document.getElementById('stock').value
    const category = document.getElementById('category').value
    const status = document.getElementById('status').value

    if (!title || !description || !code || !price || !stock || !category || !status) {
        alert("Por favor, complete todos los campos.")
        return false;
    }
    if (price <= 0) {
        alert("El precio debe ser un número positivo.")
        return false;
    }
    if (stock <= 0) {
        alert("El stock debe ser un número positivo.")
        return false;
    }
    return true;
}


//submit
myForm.addEventListener('submit', function(event) {
    event.preventDefault()
    if (!validateForm()) {
        //nose envia nada
        return 
    }
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = Number(document.getElementById('price').value)
    const stock = Number(document.getElementById('stock').value)
    const category = document.getElementById('category').value
    const status = Boolean(document.getElementById('status').value)
    
    // Emitir el evento 'createProduct' al servidor con los datos del formulario
    socket.emit('createProduct', { title, description, code, price, stock, category, status })

    myForm.reset()
})
//first products list message
socket.on('products', function(data) {
    let productsContainer = document.getElementById('porducts-container')
    productsContainer.innerHTML = ""
  
    data.forEach(product => {
        let productCard = document.createElement('div')
        productCard.classList.add('product-card')
        productCard.id = `product-card-${product.id}`
    
        productCard.innerHTML = `
            <strong>ID:</strong> ${product.id}<br>
            <strong>Título:</strong> ${product.title}<br>
            <strong>Descripción:</strong> ${product.description}<br>
            <strong>Código:</strong> ${product.code}<br>
            <strong>Precio:</strong> <span class="price">$${product.price}</span><br>
            <strong>Estado:</strong> ${product.status ? 'Disponible' : 'No disponible'}<br>
            <span class="stock">Stock: ${product.stock} unidades</span><br>
            <span class="category">${product.category}</span>
            <button class="delete-button" id="delete-button-${product.id}" onclick="deleteProduct(${product.id})">Eliminar</button>
            <hr>
        `
        productsContainer.appendChild(productCard)
    })
})

// Escuchar respuesta del servidor cuando se crea un producto, y agregar el producto a la lista
socket.on('productCreated', function(data) {
    //hacer una nueva card
    //alert(data.id)
    let productsContainer = document.getElementById('porducts-container')
    let productCard = document.createElement('div')
    productCard.classList.add('product-card')
    productCard.id = `product-card-${data.id}`

    productCard.innerHTML = `
        <strong>ID:</strong> ${data.id}<br>
        <strong>Título:</strong> ${data.title}<br>
        <strong>Descripción:</strong> ${data.description}<br>
        <strong>Código:</strong> ${data.code}<br>
        <strong>Precio:</strong> <span class="price">$${data.price}</span><br>
        <strong>Estado:</strong> ${data.status ? 'Disponible' : 'No disponible'}<br>
        <span class="stock">Stock: ${data.stock} unidades</span><br>
        <span class="category">${data.category}</span>
        <button class="delete-button" id="delete-button-${data.id}" onclick="deleteProduct(${data.id})">Eliminar</button>
        <hr>
    `
    productsContainer.appendChild(productCard)
})

function deleteProduct(id) {
//    alert("eliminar" + id)

    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        socket.emit('deleteProduct', id)   
       
    }
    
}
socket.on('confirmDelete',function(id){
    let productCard = document.getElementById(`product-card-${id}`)
    productCard.remove()
})