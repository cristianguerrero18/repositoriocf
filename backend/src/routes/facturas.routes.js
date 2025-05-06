import {Router} from "express";
import { methodHTTP as facturasController } from "../controllers/facturas.controllers.js";


const router = Router();


router.get("/", facturasController.getFacturas)
router.get("/:id", facturasController.getFacturaConCompra);
router.get("/usuario/:id_usuario", facturasController.getFacturaPorUsuario);

export default router;

