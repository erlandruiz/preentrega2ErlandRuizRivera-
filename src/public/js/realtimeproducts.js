const socket = io();

console.log('socket io en REALTIMEPRODUCTS');

socket.on('bienvenidoDesdeServer', (msg) => {
    console.log(msg);
});

socket.emit('respuestaDesdeClient', 'Hola Servidor');

document.addEventListener('DOMContentLoaded', async () => {
    // Esperar a que el documento HTML esté completamente cargado
    await fetchAndRenderProducts();

    document.getElementById('add-product-button').addEventListener('click', async () => {
        await addProduct();
        await fetchAndRenderProducts();
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async function () {
            const id = button.getAttribute('data-id');
            await deleteProduct(id);
            await fetchAndRenderProducts();
        });
    });
});

async function fetchAndRenderProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map((product, index) => `
        <div class="product-display" id="product-${index}">
            <h3>Producto ${index+1} </h3>
            <div><label>ID:</label><span>${product.id}</span></div>
            <div><label>Title:</label><span>${product.title}</span></div>
            <div><label>Description:</label><span>${product.description}</span></div>
            <div><label>Code:</label><span>${product.code}</span></div>
            <div><label>Price:</label><span>${product.price}</span></div>
            <div><label>Stock:</label><span>${product.stock}</span></div>
            <div><label>Category:</label><span>${product.category}</span></div>
            <div><label>Thumbnails:</label><span>${product.thumbnails}</span></div>
            <button type="button" class="delete-button" data-id="${product.id}">Eliminar Producto</button>
        </div>
        <hr>
    `).join('');

    // Re-attach delete event listeners
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async function () {
            const id = button.getAttribute('data-id');
            await deleteProduct(id);
            await fetchAndRenderProducts();
        });
    });
}

async function addProduct() {
    // const id = document.getElementById('new-id').value;
    const title = document.getElementById('new-title').value;
    const description = document.getElementById('new-description').value;
    const code = document.getElementById('new-code').value;
    const price = document.getElementById('new-price').value;
    const stock = document.getElementById('new-stock').value;
    const category = document.getElementById('new-category').value;
    const thumbnails = document.getElementById('new-thumbnails').value;

    const newProduct = {
         title, description, code, price, stock, category, thumbnails
        // id, title, description, code, price, stock, category, thumbnails
    };

    try {
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function deleteProduct(id) {
    try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}


