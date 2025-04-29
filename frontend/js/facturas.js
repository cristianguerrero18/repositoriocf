import { obtainFacturas  } from "../apiConnection/consumeFacturas.js";

document.addEventListener("DOMContentLoaded", ()=>{
    getFacturas();
})

async function getFacturas(){
    const facturasObtained = await obtainFacturas();
    const container = document.querySelector('#facturas-body')
    facturasObtained.forEach((factura)=>{
        const {
            id_factura, id_compra, numero_factura, fecha_emision, total} = factura

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
        console.log("Datos de la factura recibidos:", facturaData); // Para depuración
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

        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#e3f2fd';
        modal.style.padding = '30px';
        modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.1)';
        modal.style.zIndex = '1000';
        modal.style.borderRadius = '15px';
        modal.style.maxWidth = '800px';
        modal.style.width = '95%';
        modal.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        modal.style.border = '1px solid #bbdefb';
    }

    let detallesHTML = '';
    if (detalles_compra && detalles_compra.length > 0) {
        detallesHTML = `
            <h4 style="margin-top: 20px; color: #1e88e5;"><i class="fas fa-list-ul" style="margin-right: 5px;"></i> Detalles de la Compra</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border-radius: 8px; overflow: hidden;">
                <thead style="background-color: #bbdefb;">
                    <tr>
                        <th style="text-align: left; padding: 12px; border-bottom: 2px solid #90caf9; color: #1565c0;"><i class="fas fa-box-open" style="margin-right: 5px;"></i> Producto</th>
                        <th style="text-align: right; padding: 12px; border-bottom: 2px solid #90caf9; color: #1565c0;"><i class="fas fa-sort-numeric-up-alt" style="margin-right: 5px;"></i> Cantidad</th>
                        <th style="text-align: right; padding: 12px; border-bottom: 2px solid #90caf9; color: #1565c0;"><i class="fas fa-dollar-sign" style="margin-right: 5px;"></i> Precio Unitario</th>
                        <th style="text-align: right; padding: 12px; border-bottom: 2px solid #90caf9; color: #1565c0;"><i class="fas fa-calculator" style="margin-right: 5px;"></i> Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${detalles_compra.map(detalle => `
                        <tr style="background-color: #e3f2fd;">
                            <td style="padding: 10px; border-bottom: 1px solid #cfd8dc;">${detalle.nombre_producto}</td>
                            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #cfd8dc;">${detalle.cantidad}</td>
                            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #cfd8dc;">$${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #cfd8dc;">$${parseFloat(detalle.subtotal).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot style="background-color: #bbdefb;">
                    <tr>
                        <td colspan="3" style="text-align: right; padding: 10px; color: #1565c0;"><strong>Total:</strong></td>
                        <td style="text-align: right; padding: 10px; color: #1565c0;"><strong>$${detalles_compra.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
    } else {
        detallesHTML = '<p style="color: #78909c;"><i class="fas fa-info-circle" style="margin-right: 5px;"></i> No hay detalles de compra para esta factura.</p>';
    }

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; color: #1e88e5;">
            <h2 style="margin: 0;"><i class="fas fa-file-invoice-dollar" style="margin-right: 10px;"></i> Factura</h2>
            <button id="close-factura-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #78909c;" title="Cerrar"><i class="fas fa-times-circle"></i></button>
        </div>

        <div style="border: 1px solid #90caf9; padding: 20px; border-radius: 10px; background-color: #fff;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                    <h4 style="margin-top: 0; color: #1e88e5;"><i class="fas fa-user" style="margin-right: 5px;"></i> Detalles del Cliente</h4>
                    <p style="margin-bottom: 5px; color: #37474f;"><strong>Nombre:</strong> ${nombre_usuario || 'N/A'}</p>
                    <p style="margin-bottom: 5px; color: #37474f;"><strong>Cédula:</strong> ${cedula_usuario || 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <h4 style="margin-top: 0; color: #1e88e5;"><i class="fas fa-info-circle" style="margin-right: 5px;"></i> Información de la Factura</h4>
                    <p style="margin-bottom: 5px; color: #37474f;"><strong>Número:</strong> ${numero_factura}</p>
                    <p style="margin-bottom: 5px; color: #37474f;"><strong>Fecha de Emisión:</strong> ${new Date(fecha_emision).toLocaleDateString()}</p>
                </div>
            </div>

            ${detallesHTML}

            <div style="text-align: right; margin-top: 20px;">
                <button id="download-pdf-button" style="background-color: #1e88e5; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    <i class="fas fa-file-pdf" style="margin-right: 5px;"></i> Descargar PDF
                </button>
                <button id="close-modal-button" style="background-color: #ff5722; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                    <i class="fas fa-times" style="margin-right: 5px;"></i> Cerrar
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    document.getElementById('close-factura-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('close-modal-button').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('download-pdf-button').addEventListener('click', () => {
        alert('Función para descargar el PDF de la factura con número: ' + numero_factura);
    });
}
