import {Router} from "express";
import { methodHTTP as facturasController } from "../controllers/facturas.controllers.js";


const router = Router();


router.get("/", facturasController.getFacturas)
router.get("/:id", facturasController.getFacturaConCompra);

export default router;

