import { obtainProductos } from "../apiConnection/consumeProductos.js";
import { postCompra } from "../apiConnection/consumeCompras.js";
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un usuario en sesión
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.tipo !== 'cliente') {
        // Redirigir al login si no hay usuario o no es cliente
        window.location.href = 'cliente.html';
        return;
    }

    // Mostrar nombre del usuario
    document.getElementById('user-name').textContent = currentUser.nombre;

    // Cargar productos
    loadProducts();

    // Inicializar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartUI();

    // Event listeners
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        window.location.href = 'login.html';
    });

    document.getElementById('search-btn').addEventListener('click', function() {
        filterProducts();
    });

    document.getElementById('search-input').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterProducts();
        }
    });

    document.getElementById('filter-select').addEventListener('change', function() {
        filterProducts();
    });

    document.getElementById('add-to-cart-modal').addEventListener('click', function() {
        const productId = this.dataset.productId;
        const quantity = parseInt(document.getElementById('product-quantity').value);
        addToCart(productId, quantity);
        
        // Cerrar modal después de agregar al carrito
        const modal = bootstrap.Modal.getInstance(document.getElementById('product-modal'));
        modal.hide();
    });

    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        showCheckoutModal();
    });

    document.getElementById('confirm-checkout').addEventListener('click', function() {
        processCheckout();
    });

    // Funciones
    async function loadProducts() {
        try {
            const productos = await obtainProductos();
            const container = document.getElementById('products-container');
            container.innerHTML = '';
            
            productos.forEach(producto => {
                const { id_producto, nombre, marca, modelo, descripcion, precio_unitario, stock, imagen } = producto;
                
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 col-lg-3 mb-4';
                productCard.innerHTML = `
                    <div class="card product-card">
                        <img src="${imagen}" class="card-img-top product-img" alt="${nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${nombre}</h5>
                            <p class="card-text">
                                <strong>Marca:</strong> ${marca}<br>
                                <strong>Precio:</strong> $${precio_unitario.toFixed(2)}
                            </p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary view-details" data-id="${id_producto}">
                                    <i class="bi bi-eye"></i> Ver detalles
                                </button>
                                <button class="btn btn-sm btn-primary add-to-cart" data-id="${id_producto}">
                                    <i class="bi bi-cart-plus"></i> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(productCard);
            });
            
            // Agregar event listeners a los botones
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    showProductDetails(productId);
                });
            });
            
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    addToCart(productId, 1);
                });
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            alert('Error al cargar los productos');
        }
    }

    async function showProductDetails(productId) {
        try {
            const productos = await obtainProductos();
            const producto = productos.find(p => p.id_producto == productId);
            
            if (!producto) {
                alert('Producto no encontrado');
                return;
            }
            
            const { nombre, marca, modelo, descripcion, precio_unitario, stock, imagen } = producto;
            
            document.getElementById('modal-product-name').textContent = nombre;
            document.getElementById('modal-product-image').src = imagen;
            document.getElementById('modal-product-price').textContent = `$${precio_unitario.toFixed(2)}`;
            document.getElementById('modal-product-brand').textContent = marca;
            document.getElementById('modal-product-model').textContent = modelo;
            document.getElementById('modal-product-stock').textContent = stock;
            document.getElementById('modal-product-description').textContent = descripcion;
            document.getElementById('product-quantity').value = 1;
            document.getElementById('product-quantity').max = stock;
            
            // Guardar el ID del producto en el botón de agregar al carrito
            document.getElementById('add-to-cart-modal').dataset.productId = productId;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('product-modal'));
            modal.show();
        } catch (error) {
            console.error('Error al mostrar detalles del producto:', error);
            alert('Error al cargar los detalles del producto');
        }
    }

    function addToCart(productId, quantity) {
        if (quantity <= 0) {
            alert('Por favor, selecciona una cantidad válida');
            return;
        }
        
        obtainProductos().then(productos => {
            const producto = productos.find(p => p.id_producto == productId);
            
            if (!producto) {
                alert('Producto no encontrado');
                return;
            }
            
            if (quantity > producto.stock) {
                alert(`Solo hay ${producto.stock} unidades disponibles`);
                return;
            }
            
            // Verificar si el producto ya está en el carrito
            const existingItemIndex = cart.findIndex(item => item.id == productId);
            
            if (existingItemIndex >= 0) {
                // Actualizar cantidad
                const newQuantity = cart[existingItemIndex].quantity + quantity;
                
                if (newQuantity > producto.stock) {
                    alert(`No puedes agregar más unidades. Stock disponible: ${producto.stock}`);
                    return;
                }
                
                cart[existingItemIndex].quantity = newQuantity;
            } else {
                // Agregar nuevo item
                cart.push({
                    id: productId,
                    name: producto.nombre,
                    price: producto.precio_unitario,
                    image: producto.imagen,
                    quantity: quantity
                });
            }
            
            // Guardar carrito en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Actualizar UI
            updateCartUI();
            
            // Mostrar mensaje
            alert(`${producto.nombre} agregado al carrito`);
        }).catch(error => {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        });
    }

    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-details">
                    <div>${item.name}</div>
                    <div>${item.quantity} x $${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-remove" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function filterProducts() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filterValue = document.getElementById('filter-select').value;
        
        obtainProductos().then(productos => {
            // Filtrar por término de búsqueda
            let filteredProducts = productos;
            
            if (searchTerm) {
                filteredProducts = productos.filter(producto => 
                    producto.nombre.toLowerCase().includes(searchTerm) ||
                    producto.marca.toLowerCase().includes(searchTerm) ||
                    producto.modelo.toLowerCase().includes(searchTerm) ||
                    producto.descripcion.toLowerCase().includes(searchTerm)
                );
            }
            
            // Ordenar según el filtro seleccionado
            switch (filterValue) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.precio_unitario - b.precio_unitario);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.precio_unitario - a.precio_unitario);
                    break;
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
                    break;
            }
            
            // Actualizar UI
            const container = document.getElementById('products-container');
            container.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                container.innerHTML = '<div class="col-12"><p class="text-center">No se encontraron productos</p></div>';
                return;
            }
            
            filteredProducts.forEach(producto => {
                const { id_producto, nombre, marca, modelo, descripcion, precio_unitario, stock, imagen } = producto;
                
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 col-lg-3 mb-4';
                productCard.innerHTML = `
                    <div class="card product-card">
                        <img src="${imagen}" class="card-img-top product-img" alt="${nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${nombre}</h5>
                            <p class="card-text">
                                <strong>Marca:</strong> ${marca}<br>
                                <strong>Precio:</strong> $${precio_unitario.toFixed(2)}
                            </p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary view-details" data-id="${id_producto}">
                                    <i class="bi bi-eye"></i> Ver detalles
                                </button>
                                <button class="btn btn-sm btn-primary add-to-cart" data-id="${id_producto}">
                                    <i class="bi bi-cart-plus"></i> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(productCard);
            });
            
            // Agregar event listeners a los botones
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    showProductDetails(productId);
                });
            });
            
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    addToCart(productId, 1);
                });
            });
        }).catch(error => {
            console.error('Error al filtrar productos:', error);
            alert('Error al filtrar los productos');
        });
    }

    function showCheckoutModal() {
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');
        
        checkoutItems.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between mb-2';
            itemElement.innerHTML = `
                <span>${item.quantity} x ${item.name}</span>
                <span>$${subtotal.toFixed(2)}</span>
            `;
            checkoutItems.appendChild(itemElement);
        });
        
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
        
        const modal = new bootstrap.Modal(document.getElementById('checkout-modal'));
        modal.show();

    }

async function processCheckout() {
     
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("Usuario actual desde localStorage:", currentUser);
    
        if (cart.length === 0) {
            console.error('El carrito está vacío.');
            alert('Tu carrito está vacío');
            return;
        }
    
        // Verificar si currentUser está definido antes de continuar
        if (!currentUser || !currentUser.id) {
            console.error('No se encontró usuario válido en localStorage o el ID de usuario es incorrecto.');
            alert('No has iniciado sesión o el usuario no está correctamente definido.');
            return;
        }
    
        try {
            // Obtener ID del usuario actual
            const userId = currentUser.id;
            console.log("ID de usuario:", userId);
    
            // Procesar cada producto en el carrito
            for (const item of cart) {
                if (!item.id || !item.quantity) {
                    console.error("Producto inválido en carrito:", item);
                    alert("Hay productos inválidos en tu carrito.");
                    return;
                }
    
                const compra = {
                    p_id_usuario: userId,
                    p_id_producto: item.id,
                    p_cantidad: item.quantity
                };
    
                console.log("Enviando compra para el producto:", compra);
                await postCompra(compra);
            }
    
            // Limpiar carrito
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
    
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('checkout-modal'));
            modal.hide();
    
            // Mostrar mensaje de éxito
            console.log('Compra realizada con éxito');
            alert('¡Compra realizada con éxito! Gracias por tu compra.');
    
            // Recargar productos para actualizar stock
            loadProducts();
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            alert('Error al procesar la compra. Por favor, intenta de nuevo.');
        }
    }
    
});