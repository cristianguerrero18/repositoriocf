import getConnection from "../db/database.js"
const getCompras =  async (req , res) => {
    
    try {
         const connection = await getConnection();
         const result = await connection.query("SELECT id_compra, id_usuario, fecha_compra, total  FROM compras");
         res.json(result);
    } catch (error) {
        console.log("error 505");
    }
}
const postCompra = async (req, res) => {
    try {
        const { p_id_usuario, p_id_producto, p_cantidad } = req.body;

        // Validar que no estén vacíos
        if (p_id_usuario === undefined || p_id_producto === undefined || p_cantidad === undefined) {
            return res.status(400).json({ message: "Faltan datos para procesar la compra" });
        }

        const connection = await getConnection();
        await connection.query("CALL realizar_compra(?, ?, ?)", [
            p_id_usuario,
            p_id_producto,
            p_cantidad
        ]);

        res.status(201).json({ message: "Compra realizada correctamente" });

    } catch (error) {
        console.error("Error al ejecutar la compra:", error);
        res.status(500).send(error.message || "Error al ejecutar la compra");
    }
};


const getComprasPorUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        
        const query = `
            SELECT 
                c.id_compra,
                c.fecha_compra,
                c.total,
                f.numero_factura,
                dc.id_detalle,
                dc.cantidad,
                dc.precio_unitario,
                dc.subtotal,
                p.id_producto,
                p.nombre AS nombre_producto,
                p.marca,
                p.modelo,
                p.descripcion AS descripcion_producto
            FROM 
                compras c
            JOIN 
                detalle_compras dc ON c.id_compra = dc.id_compra
            JOIN 
                productos p ON dc.id_producto = p.id_producto
            LEFT JOIN
                facturas f ON c.id_compra = f.id_compra
            WHERE 
                c.id_usuario = ?
            ORDER BY 
                c.fecha_compra DESC
        `;
        
        const result = await connection.query(query, [id]);

        if (result.length > 0) {
           
            const comprasAgrupadas = result.reduce((acc, row) => {
                const compraExistente = acc.find(c => c.id_compra === row.id_compra);
                
                if (compraExistente) {
                    compraExistente.detalles.push({
                        id_detalle: row.id_detalle,
                        id_producto: row.id_producto,
                        nombre_producto: row.nombre_producto,
                        marca: row.marca,
                        modelo: row.modelo,
                        descripcion: row.descripcion_producto,
                        cantidad: row.cantidad,
                        precio_unitario: row.precio_unitario,
                        subtotal: row.subtotal
                    });
                } else {
                    acc.push({
                        id_compra: row.id_compra,
                        fecha_compra: row.fecha_compra,
                        total: row.total,
                        numero_factura: row.numero_factura,
                        detalles: [{
                            id_detalle: row.id_detalle,
                            id_producto: row.id_producto,
                            nombre_producto: row.nombre_producto,
                            marca: row.marca,
                            modelo: row.modelo,
                            descripcion: row.descripcion_producto,
                            cantidad: row.cantidad,
                            precio_unitario: row.precio_unitario,
                            subtotal: row.subtotal
                        }]
                    });
                }
                return acc;
            }, []);
            
            res.json(comprasAgrupadas);
        } else {
            res.status(404).json({ message: "No se encontraron compras para este usuario" });
        }
    } catch (error) {
        console.error("Error al obtener compras por usuario:", error);
        res.status(500).json({ 
            error: "Error al obtener compras", 
            details: error.message 
        });
    }
};

export const methodHTTP = {
    getCompras,
    postCompra,
    getComprasPorUsuario
}