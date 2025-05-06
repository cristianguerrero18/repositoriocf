import { obtainFacturasPorUsuario } from "../apiConnection/consumeFacturas.js";

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const facturasContainer = document.getElementById('facturas-container');
    const totalFacturasBadge = document.getElementById('total-facturas');
    const userNameElement = document.getElementById('user-name');
    const userButtonsContainer = document.getElementById('user-buttons');

    if (currentUser) {
        userNameElement.textContent = currentUser.nombre;
        setupUserButtons();
        loadFacturaHistory();
    } else {
        window.location.href = 'login.html';
    }

    async function loadFacturaHistory() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let facturas = await obtainFacturasPorUsuario(currentUser.id);
            console.log('Facturas recibidas:', facturas);
    
            // Validación robusta de facturas
            const noFacturasConditions = [
                !facturas,
                (typeof facturas === 'object' && Object.keys(facturas).length === 0),
                (Array.isArray(facturas) && facturas.length === 0),
                (facturas && facturas.numero_factura === undefined && !Array.isArray(facturas))
            ];
    
            if (noFacturasConditions.some(condition => condition)) {
                return showNoInvoicesMessage();
            }
    
            // Convertir a array si es un objeto individual
            if (!Array.isArray(facturas)) {
                facturas = [facturas];
            }
    
            // Filtrar facturas inválidas
            facturas = facturas.filter(factura => 
                factura && 
                factura.numero_factura !== undefined && 
                factura.fecha_emision &&
                (Array.isArray(factura.detalles_compra) || factura.detalles_compra === undefined)
            );
    
            if (facturas.length === 0) {
                return showNoInvoicesMessage();
            }
    
            // Mostrar las facturas
            totalFacturasBadge.textContent = `${facturas.length} ${facturas.length === 1 ? 'factura' : 'facturas'}`;
            facturasContainer.innerHTML = '';
    
            facturas.forEach((factura, index) => {
                const idFactura = factura.numero_factura;
                const fechaFactura = factura.fecha_emision;
                const detalles = Array.isArray(factura.detalles_compra) ? factura.detalles_compra : [];
                const total = detalles.reduce((sum, item) => sum + (item.subtotal || 0), 0);
                
                const fechaEmision = new Date(fechaFactura);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const fechaFormateada = fechaEmision.toLocaleDateString('es-ES', options);
    
                const detallesHTML = detalles.map(item => `
                    <tr>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; vertical-align: top;">${item.nombre_producto || 'Producto no especificado'}</td>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: top;">${item.cantidad || 0}</td>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right; vertical-align: top;">$${parseFloat(item.precio_unitario || 0).toFixed(2)}</td>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right; vertical-align: top;">$${parseFloat(item.subtotal || 0).toFixed(2)}</td>
                    </tr>
                `).join('');
    
                const facturaElement = document.createElement('div');
                facturaElement.className = 'accordion-item mb-4 border-0';
                facturaElement.innerHTML = `
                    <h2 class="accordion-header" id="heading-${idFactura}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'} p-3" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse-${idFactura}" 
                                aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                aria-controls="collapse-${idFactura}">
                            <div class="d-flex justify-content-between w-100 me-3 align-items-center">
                                <div class="d-flex flex-column">
                                    <span class="fw-bold fs-6">Factura #${idFactura}</span>
                                    <span class="text-muted small mt-1">${fechaFormateada}</span>
                                </div>
                                <div>
                                    <span class="badge bg-success fs-6 p-2">$${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse-${idFactura}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                         aria-labelledby="heading-${idFactura}">
                        <div class="accordion-body p-4" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <!-- Encabezado de la factura -->
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                                <div>
                                    <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: 600;">MOVILES CF</h1>
                                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">NIT: 900123456-7</p>
                                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">Calle 123 #45-67, Bucaramanga Santander</p>
                                </div>
                                
                                <div style="text-align: right;">
                                    <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 28px; font-weight: 700;">FACTURA</h2>
                                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;"><strong>Número:</strong> ${idFactura}</p>
                                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;"><strong>Fecha:</strong> ${fechaFormateada}</p>
                                </div>
                            </div>
                            
                            <!-- Información del cliente -->
                            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
                                <div>
                                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">DATOS DEL CLIENTE</h3>
                                    <p style="margin: 5px 0; color: #34495e;"><strong>Nombre:</strong> ${factura.nombre_usuario || currentUser.nombre || 'N/A'}</p>
                                    <p style="margin: 5px 0; color: #34495e;"><strong>Cédula:</strong> ${factura.cedula_usuario || currentUser.cedula || 'N/A'}</p>
                                </div>
                                <div style="text-align: right;">
                                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">INFORMACIÓN DE PAGO</h3>
                                    <p style="margin: 5px 0; color: #34495e;"><strong>Método de pago:</strong> ${factura.metodo_pago || 'Efectivo'}</p>
                                    <p style="margin: 5px 0; color: #34495e;"><strong>Estado:</strong> ${factura.estado || 'Pagado'}</p>
                                </div>
                            </div>
                            
                            <!-- Detalles de la compra -->
                            <div style="margin-top: 20px;">
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <thead>
                                        <tr style="background-color: #f8f9fa;">
                                            <th style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: left;">Producto</th>
                                            <th style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center;">Cantidad</th>
                                            <th style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right;">Precio Unitario</th>
                                            <th style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right;">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${detallesHTML || '<tr><td colspan="4" style="text-align: center; padding: 20px;">No hay productos en esta factura</td></tr>'}
                                    </tbody>
                                    <tfoot>
                                        <tr style="background-color: #f8f9fa; font-weight: bold;">
                                            <td colspan="3" style="padding: 12px 15px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
                                            <td style="padding: 12px 15px; text-align: right; border-top: 2px solid #dee2e6;">$${total.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            <!-- Pie de página -->
                            <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="flex: 1;">
                                        <p style="margin: 5px 0; color: #7f8c8d; font-size: 12px; line-height: 1.5;">
                                            <strong>NOTA:</strong> Gracias por su compra. Esta factura es un documento legal. 
                                            Cualquier reclamo debe realizarse dentro de los 5 días hábiles siguientes a la compra.
                                        </p>
                                    </div>
                                    <div style="margin-left: 30px; text-align: center;">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?data=Factura-${idFactura}&size=100x100" 
                                             alt="QR Factura" style="height: 80px; margin-bottom: 5px;">
                                        <p style="margin: 0; color: #7f8c8d; font-size: 10px;">Código de verificación</p>
                                    </div>
                                </div>
                                
                                <div style="text-align: center; margin-top: 20px;">
                                    <p style="margin: 0; color: #7f8c8d; font-size: 12px;">
                                        MOVILES CF - Todos los derechos reservados © ${new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                facturasContainer.appendChild(facturaElement);
            });
    
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            facturasContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar tus facturas. Por favor intenta nuevamente.
                    ${currentUser?.isAdmin ? `<br><small>${error.message}</small>` : ''}
                </div>
            `;
        }
    }
    
    // Función auxiliar para mostrar mensaje de no hay facturas
    function showNoInvoicesMessage() {
        facturasContainer.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="bi bi-receipt" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h4 class="alert-heading">No tienes facturas registradas</h4>
                <p>Cuando realices tu primera compra, aparecerán aquí tus facturas.</p>
            </div>
        `;
        totalFacturasBadge.textContent = '0 facturas';
    }

    function setupUserButtons() {
        userButtonsContainer.innerHTML = `
            <button id="profile-btn" class="btn btn-outline-light btn-sm me-2">
                <i class="bi bi-person-circle"></i> Mi Perfil
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