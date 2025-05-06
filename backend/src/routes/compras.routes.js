import {Router} from "express";
import { methodHTTP as comprasController } from "../controllers/compras.controllers.js";


const router = Router();


router.get("/", comprasController.getCompras)
router.post("/", comprasController.postCompra);
router.get("/usuario/:id", comprasController.getComprasPorUsuario);



export default router;