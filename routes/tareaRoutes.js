import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
} from "../controllers/tareaController.js";

const tareaRoutes = express.Router();

tareaRoutes.post("/", checkAuth, agregarTarea); // agregar tarea

// obtener, actualizar, eliminar una tarea
tareaRoutes
  .route("/:id")
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, actualizarTarea)
  .delete(checkAuth, eliminarTarea);

// cambiar estado de la tarea
tareaRoutes.post("/estado/:id", checkAuth, cambiarEstado);

export default tareaRoutes;
