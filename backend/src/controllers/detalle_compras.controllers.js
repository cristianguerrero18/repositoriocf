import getConnection from "../db/database.js"
const getDetalle_Compras =  async (req , res) => {
    
    try {
         const connection = await getConnection();
         const result = await connection.query("SELECT id_detalle, id_compra, id_producto, cantidad, precio_unitario, subtotal  FROM detalle_compras");
         res.json(result);
    } catch (error) {
        console.log("error 505");
    }
}


export const methodHTTP = {
    getDetalle_Compras
}
