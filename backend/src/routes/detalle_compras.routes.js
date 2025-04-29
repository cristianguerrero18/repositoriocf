import {Router} from "express";
import { methodHTTP as detalle_comprasController } from "../controllers/detalle_compras.controllers.js";


const router = Router();


router.get("/", detalle_comprasController.getDetalle_Compras)

export default router;
