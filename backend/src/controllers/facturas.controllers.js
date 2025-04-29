import getConnection from "../db/database.js"
const getFacturas =  async (req , res) => {
    
    try {
         const connection = await getConnection();
         const result = await connection.query("SELECT id_factura, id_compra, numero_factura, fecha_emision, total FROM facturas");
         res.json(result);
    } catch (error) {
        console.log("error 505");
    }
}

const getFacturaConCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();

        const facturaResult = await connection.query(`
            SELECT f.numero_factura, f.fecha_emision, f.id_compra, u.cedula, u.nombre AS nombre_usuario
            FROM facturas f
            INNER JOIN compras c ON f.id_compra = c.id_compra
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE f.id_factura = ?
        `, id);

        if (facturaResult.length === 0) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        const facturaData = facturaResult[0];
        const idCompra = facturaData.id_compra;

        const detalleCompraResult = await connection.query(`
            SELECT
                dc.id_producto,
                p.nombre AS nombre_producto,
                dc.cantidad,
                dc.precio_unitario,
                dc.subtotal
            FROM
                detalle_compras dc
            INNER JOIN
                productos p ON dc.id_producto = p.id_producto
            WHERE
                dc.id_compra = ?
        `, idCompra);

        if (detalleCompraResult.length > 0) {
            res.json({
                numero_factura: facturaData.numero_factura,
                fecha_emision: facturaData.fecha_emision,
                cedula_usuario: facturaData.cedula,
                nombre_usuario: facturaData.nombre_usuario,
                detalles_compra: detalleCompraResult
            });
        } else {
            res.status(404).json({ message: "No se encontraron detalles para esta compra" });
        }

    } catch (error) {
        console.error("Error al obtener detalles de la compra:", error);
        res.status(500).json({ error: "Error al obtener detalles de la compra", details: error.message });
    }
};
export const methodHTTP = {
    getFacturas ,
    getFacturaConCompra   
}
