import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

// AGREGAR UNA TAREA
const agregarTarea = async (req, res) => {
  const { usuario } = req;
  const { proyecto } = req.body;
  try {
    const existeProyecto = await Proyecto.findById(proyecto);
    if (existeProyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos para añadir tareas");
      return res.status(401).json({ msg: error.message });
    }

    const tarea = new Tarea(req.body);
    const tareaAlmacenada = await tarea.save();
    existeProyecto.tareas.push(tarea._id);
    await existeProyecto.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Tarea no encontrada" });
  }
};

// OBTENER UNA TAREA
const obtenerTarea = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const tarea = await Tarea.findById(id).populate("proyecto"); // trae la referencia de proyecto de la tarea
    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos para obtener tareas");
      return res.status(403).json({ msg: error.message });
    }
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Tarea no encontrada" });
  }
};

// ACTUALIZAR UNA TAREA
const actualizarTarea = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nombre, descripcion, prioridad, fechaEntrega } = req.body;
  try {
    const tarea = await Tarea.findById(id).populate("proyecto"); // trae la referencia de proyecto de la tarea
    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos para actualizar tareas");
      return res.status(403).json({ msg: error.message });
    }

    if (nombre) {
      tarea.nombre = nombre;
    }
    if (descripcion) {
      tarea.descripcion = descripcion;
    }
    if (prioridad) {
      tarea.prioridad = prioridad;
    }
    if (fechaEntrega) {
      tarea.fechaEntrega = fechaEntrega;
    }

    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Tarea no encontrada" });
  }
};

// ELIMINAR UNA TAREA
const eliminarTarea = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const tarea = await Tarea.findById(id).populate("proyecto"); // trae la referencia de proyecto de la tarea
    if (tarea.proyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos para eliminar tareas");
      return res.status(403).json({ msg: error.message });
    }

    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);

    await Promise.all([await proyecto.save(), await tarea.deleteOne()]);

    res.json({ msg: "Tarea eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Tarea no encontrada" });
  }
};

// CAMBIAR EL ESTADO DE UNA TAREA
const cambiarEstado = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const tarea = await Tarea.findById(id).populate("proyecto"); // trae la referencia de proyecto de la tarea
    // Verificar los permisos
    if (
      tarea.proyecto.creador.toString() !== usuario._id.toString() &&
      !tarea.proyecto.colaboradores.some(
        (colaborador) => colaborador._id.toString() === usuario._id.toString()
      )
    ) {
      const error = new Error(
        "No tienes permisos para cambiar el estado de la tarea"
      );
      return res.status(403).json({ msg: error.message });
    }
    // Cambiar el estado de la tarea
    tarea.estado = !tarea.estado;
    tarea.completado = usuario._id;
    await tarea.save();
    const tareaAlmacenada = await Tarea.findById(id).populate("completado");
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Tarea no encontrada" });
  }
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
