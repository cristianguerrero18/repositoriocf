import express from "express";
import cors from "cors"
import productosRoutes from "./routes/productos.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import detalle_comprasRoutes from "./routes/detalle_compras.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import facturasRoutes from "./routes/facturas.routes.js"


const app = express(); 

app.set("port",5000);
app.use(express.json());

app.use(cors());

app.use("/api/facturas",facturasRoutes)
app.use("/api/productos",productosRoutes)
app.use("/api/compras",comprasRoutes)
app.use("/api/detalle_compras",detalle_comprasRoutes)
app.use("/api/usuarios",usuariosRoutes)


export default app;

