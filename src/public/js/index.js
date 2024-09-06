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
    const price = document.getElementById('price').value
    const stock = document.getElementById('stock').value
    const category = document.getElementById('category').value
    const status = document.getElementById('status').value
    
    // Emitir el evento 'crearProducto' al servidor con los datos del formulario
    socket.emit('crearProducto', { title, description, code, price, stock, category, status })

    myForm.reset()
})

// Escuchar respuesta del servidor
socket.on('productoCreado', function(data) {
    //hacer una nueva card
    alert(`Producto creado: ${data.title}`)
})