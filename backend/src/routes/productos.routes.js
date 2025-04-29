import {Router} from "express";
import { methodHTTP as productosController } from "../controllers/productos.controllers.js";


const router = Router();


router.get("/", productosController.getProductos);
router.post("/", productosController.postProducto);
router.delete("/:id", productosController.deleteProducto)




export default router;

