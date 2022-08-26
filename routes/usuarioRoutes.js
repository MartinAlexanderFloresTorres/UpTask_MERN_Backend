import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  registrar,
  auntenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  perfil
} from "../controllers/usuarioController.js";

// Instanciando el router de express
const usuarioRoutes = express.Router();

// Autenticacion, Registro y confirmacion de usuarios
usuarioRoutes.post("/", registrar); // crea un nuevo usuario
usuarioRoutes.post("/login", auntenticar); // autenticacion del usuario
usuarioRoutes.get("/confirmar/:token", confirmar); // confirmar usuario
usuarioRoutes.post("/olvide-password", olvidePassword); // recuperar password
usuarioRoutes.put("/actualizar-perfil", checkAuth, actualizarPerfil) // actualizar el perfil de un usuario
//validar token y definir nuevo password
usuarioRoutes.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)
usuarioRoutes.get("/perfil", checkAuth, perfil)

export default usuarioRoutes;
