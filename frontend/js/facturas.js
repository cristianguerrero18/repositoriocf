import { obtainFacturas } from "../apiConnection/consumeFacturas.js";

document.addEventListener("DOMContentLoaded", () => {
    getFacturas();
});

async function getFacturas() {
    const facturasObtained = await obtainFacturas();
    const container = document.querySelector('#facturas-body')
    
    facturasObtained.forEach((factura) => {
        const {
            id_factura, id_compra, numero_factura, fecha_emision, total
        } = factura

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${id_factura}</td>
        <td>${id_compra}</td>
        <td>${numero_factura}</td>
        <td>${fecha_emision}</td>
        <td>${total}</td>
        <td>
            <button class="btn color3 factura-details-btn" data-id_factura="${id_factura}">Ver Factura</button>
        </td>
        <td>
            <button class="btn color2">Editar</button>
        </td>
        <td>
            <button class="btn color5">Eliminar</button>
        </td>
        `;
        container.appendChild(row)
    })

    document.querySelectorAll('.factura-details-btn').forEach(button => {
        button.addEventListener('click', showFacturaDetails);
    });
}

async function showFacturaDetails(event) {
    const button = event.currentTarget;
    const id_factura = button.getAttribute('data-id_factura');

    let facturaData;
    try {
        const response = await fetch(`http://localhost:5000/api/facturas/${id_factura}`);
        facturaData = await response.json();
    } catch (error) {
        console.error("Error al obtener la factura:", error);
        alert("No se pudo obtener la información de la factura.");
        return;
    }

    const { numero_factura, fecha_emision, cedula_usuario, nombre_usuario, detalles_compra } = facturaData;

    let modal = document.getElementById('factura-details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'factura-details-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);

        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            borderRadius: '12px',
            maxWidth: '900px',
            width: '95%',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            border: '2px solid #1976d2',
            overflowY: 'auto',
            maxHeight: '90vh'
        });
    }

    let detallesHTML = '';
    if (detalles_compra && detalles_compra.length > 0) {
        detallesHTML = `
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
                        ${detalles_compra.map(detalle => `
                            <tr>
                                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; vertical-align: top;">${detalle.nombre_producto}</td>
                                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: center; vertical-align: top;">${detalle.cantidad}</td>
                                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right; vertical-align: top;">$${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                                <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; text-align: right; vertical-align: top;">$${parseFloat(detalle.subtotal).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #f8f9fa; font-weight: bold;">
                            <td colspan="3" style="padding: 12px 15px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
                            <td style="padding: 12px 15px; text-align: right; border-top: 2px solid #dee2e6;">$${detalles_compra.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    } else {
        detallesHTML = '<div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; text-align: center;"><i class="fas fa-info-circle"></i> No hay detalles de compra para esta factura.</div>';
    }

    const fechaEmision = new Date(fecha_emision);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaEmision.toLocaleDateString('es-ES', options);

    modal.innerHTML = `
        <div style="margin-bottom: 30px;">
            <!-- Encabezado de la factura -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                <div>
                    <img src="img/remove.png" alt="Logo" style="height: 70px; margin-bottom: 10px;">
                    <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: 600;">MOVILES CF</h1>
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">NIT: 900123456-7</p>
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">Calle 123 #45-67, Bucaramanga Santander</p>
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">Tel: (1) 234-5678</p>
                </div>
                
                <div style="text-align: right;">
                    <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 28px; font-weight: 700;">FACTURA</h2>
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;"><strong>Número:</strong> ${numero_factura}</p>
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;"><strong>Fecha:</strong> ${fechaFormateada}</p>
                </div>
            </div>
            
            <!-- Información del cliente -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
                <div>
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">DATOS DEL CLIENTE</h3>
                    <p style="margin: 5px 0; color: #34495e;"><strong>Nombre:</strong> ${nombre_usuario || 'N/A'}</p>
                    <p style="margin: 5px 0; color: #34495e;"><strong>Cédula:</strong> ${cedula_usuario || 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">INFORMACIÓN DE PAGO</h3>
                    <p style="margin: 5px 0; color: #34495e;"><strong>Método de pago:</strong> Efectivo</p>
                    <p style="margin: 5px 0; color: #34495e;"><strong>Estado:</strong> Pagado</p>
                </div>
            </div>
            
            <!-- Detalles de la compra -->
            ${detallesHTML}
            
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
                        <img src="https://api.qrserver.com/v1/create-qr-code/?data=Factura-${numero_factura}&size=100x100" 
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
            
            <!-- Botones de acción -->
            <div style="display: flex; justify-content: flex-end; margin-top: 25px;">
                <button id="download-pdf-button" 
                        style="background-color: #3498db; color: white; border: none; padding: 10px 20px; 
                               border-radius: 4px; font-size: 14px; cursor: pointer; margin-right: 10px;
                               display: flex; align-items: center;">
                    <i class="fas fa-file-pdf" style="margin-right: 8px;"></i> Descargar PDF
                </button>
                <button id="close-modal-button" 
                        style="background-color: #e74c3c; color: white; border: none; padding: 10px 20px; 
                               border-radius: 4px; font-size: 14px; cursor: pointer;
                               display: flex; align-items: center;">
                    <i class="fas fa-times" style="margin-right: 8px;"></i> Cerrar
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    document.getElementById('close-modal-button').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}