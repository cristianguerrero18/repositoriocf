import {Router} from "express";
import { methodHTTP as usuariosController } from "../controllers/usuarios.controllers.js";


const router = Router();


router.get("/", usuariosController.getUsuarios)
router.post("/", usuariosController.postUsuario)
router.get("/:id", usuariosController.getUsuarioPorId)
router.delete("/:id", usuariosController.deleteUsuario);
router.post("/login", usuariosController.loginUsuario);
router.get("/correo/:email", usuariosController.getUsuarioPorCorreo);
router.put("/:id", usuariosController.putUsuario);
export default router;
