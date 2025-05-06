import {Router} from "express";
import { methodHTTP as productosController } from "../controllers/productos.controllers.js";


const router = Router();


router.get("/", productosController.getProductos);
router.post("/", productosController.postProducto);
router.delete("/:id", productosController.deleteProducto)
router.put("/:id",productosController.putProducto)




export default router;

