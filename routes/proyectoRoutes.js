import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
} from "../controllers/proyectoController.js";

const proyectoRouters = express.Router();

proyectoRouters
  .route("/")
  .get(checkAuth, obtenerProyectos) // obtener los proyectos
  .post(checkAuth, nuevoProyecto); // crear un proyecto

proyectoRouters
  .route("/:id")
  .get(checkAuth, obtenerProyecto) // obtener un proyecto
  .put(checkAuth, editarProyecto) // editar un proyecto
  .delete(checkAuth, eliminarProyecto); // eliminar un proyecto

proyectoRouters.post("/colaboradores", checkAuth, buscarColaborador); // buscar colaboradores
proyectoRouters.post("/colaboradores/:id", checkAuth, agregarColaborador); // agregar colaboradores a un proyecto
proyectoRouters.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador); // eliminar un colaborador

export default proyectoRouters;
