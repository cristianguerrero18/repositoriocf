import {  obtainComprasUsuario } from "../apiConnection/consumeCompras.js";

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const comprasContainer = document.getElementById('compras-container');
    const totalComprasBadge = document.getElementById('total-compras');
    const userNameElement = document.getElementById('user-name');
    const userButtonsContainer = document.getElementById('user-buttons');

    // Configurar UI según autenticación
    if (currentUser) {
        userNameElement.textContent = currentUser.nombre;
        setupUserButtons();
        loadPurchaseHistory();
    } else {
        window.location.href = 'login.html';
    }

    async function loadPurchaseHistory() {
        try {
            const compras = await obtainComprasUsuario(currentUser.id);
            console.log('Compras recibidas:', compras);
            
            if (!compras || compras.length === 0) {
                comprasContainer.innerHTML = `
                    <div class="alert alert-info">
                        No tienes compras registradas. <a href="index.html">Ir a comprar</a>
                    </div>
                `;
                totalComprasBadge.textContent = '0 compras';
                return;
            }

            totalComprasBadge.textContent = `${compras.length} ${compras.length === 1 ? 'compra' : 'compras'}`;
            comprasContainer.innerHTML = '';

            compras.forEach((compra, index) => {
                const compraElement = document.createElement('div');
                compraElement.className = 'accordion-item mb-3';
                compraElement.innerHTML = `
                    <h2 class="accordion-header" id="heading-${compra.id_compra}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse-${compra.id_compra}" 
                                aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                aria-controls="collapse-${compra.id_compra}">
                            <div class="d-flex justify-content-between w-100 me-3">
                                <div>
                                    <span class="fw-bold">Compra #${compra.id_compra}</span>
                                    ${compra.numero_factura ? `<span class="ms-2 badge bg-secondary">Factura: ${compra.numero_factura}</span>` : ''}
                                </div>
                                <div>
                                    <span class="text-muted me-3">${new Date(compra.fecha_compra).toLocaleDateString()}</span>
                                    <span class="badge bg-primary">$${compra.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse-${compra.id_compra}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                         aria-labelledby="heading-${compra.id_compra}">
                        <div class="accordion-body">
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio unitario</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody id="detalles-${compra.id_compra}">
                                        <!-- Detalles se cargarán aquí -->
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-end fw-bold">Total:</td>
                                            <td class="fw-bold">$${compra.total.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
                comprasContainer.appendChild(compraElement);

                // Llenar detalles de productos
                const detallesBody = document.getElementById(`detalles-${compra.id_compra}`);
                compra.detalles.forEach(detalle => {
                    const detalleRow = document.createElement('tr');
                    detalleRow.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <h6 class="mb-1">${detalle.nombre_producto}</h6>
                                    <small class="text-muted">${detalle.marca} ${detalle.modelo ? `- ${detalle.modelo}` : ''}</small>
                                </div>
                            </div>
                        </td>
                        <td>$${detalle.precio_unitario.toFixed(2)}</td>
                        <td>${detalle.cantidad}</td>
                        <td>$${detalle.subtotal.toFixed(2)}</td>
                    `;
                    detallesBody.appendChild(detalleRow);
                });
            });

        } catch (error) {
            console.error('Error al cargar historial:', error);
            comprasContainer.innerHTML = `
                <div class="alert alert-danger">
                    El usuario no tiene registradas compras
                </div>
            `;
        }
    }

    function setupUserButtons() {
        userButtonsContainer.innerHTML = `
            <button id="history-btn" class="btn btn-outline-light btn-sm me-2">
                <i class="bi bi-clock-history"></i> Mi Perfil
            </button>
            <button id="logout-btn" class="btn btn-outline-light btn-sm">
                <i class="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});