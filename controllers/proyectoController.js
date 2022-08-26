import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

// OBTENER LOS PROYECTOS DEL USUARIO AUTENTICADO
const obtenerProyectos = async (req, res) => {
  const { usuario } = req;
  // defecto es $and pero $or para validar que esos campos uno de ellos sea verdadero y devuelva la informacion correspondiente
  const proyectos = await Proyecto.find({
    $or: [{ colaboradores: { $in: usuario } }, { creador: { $in: usuario } }],
  }).select("-tareas");

  res.json(proyectos);
};

// CREAR UN NUEVO PROYECTO
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;
  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
    res.status(402).json({ msg: "Faltan campos requeridos" });
  }
};

// OBTENER UN PROYECTO
const obtenerProyecto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.findById(id)
      .populate({ path: "tareas", populate: { path: "completado", select: "nombre" } })
      .populate("colaboradores", "nombre email");

    if (
      proyecto.creador.toString() !== usuario._id.toString() &&
      !proyecto.colaboradores.some(
        (colaborador) => colaborador._id.toString() === usuario._id.toString()
      )
    ) {
      const error = new Error("No tienes permisos");
      return res.status(403).json({ msg: error.message });
    }

    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

// EDITAR UN PROYECTO
const editarProyecto = async (req, res) => {
  const { usuario } = req;
  const { nombre, descripcion, fechaEntrega, cliente } = req.body;
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.findById(id);
    if (proyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos");
      return res.status(403).json({ msg: error.message });
    }
    if (nombre) proyecto.nombre = nombre;

    if (descripcion) proyecto.descripcion = descripcion;

    if (fechaEntrega) proyecto.fechaEntrega = fechaEntrega;

    if (cliente) proyecto.cliente = cliente;

    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

// ELIMINAR UN PROYECTO
const eliminarProyecto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.findById(id);
    if (proyecto.creador.toString() !== usuario._id.toString()) {
      const error = new Error("No tienes permisos");
      return res.status(403).json({ msg: error.message });
    }
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

// BUSCAR COLABORADORES
const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-password -token -updatedAt -createdAt -__v"
  );

  // existe usuario
  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  res.json(usuario);
};
const agregarColaborador = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  // existe proyecto
  if (!proyecto._id) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // usuario creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos");
    return res.status(403).json({ msg: error.message });
  }

  const usuario = await Usuario.findOne({ email }).select(
    "-password -token -updatedAt -createdAt -__v"
  );

  // existe usuario
  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // confirmado cuenta
  if (!usuario.confirmado) {
    const error = new Error("El usuario no ha confirmado su cuenta");
    return res.status(403).json({ msg: error.message });
  }
  // si el colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar que no este ya agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El usuario ya pertenece al proyecto");
    return res.status(402).json({ msg: error.message });
  }

  // agregar un usuario a los colaboradores
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador agregado correctamente" });
};
const eliminarColaborador = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  // existe proyecto
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // usuario creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos");
    return res.status(403).json({ msg: error.message });
  }

  // eliminar una tarea
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: "Colaborador eliminador correctamente" });
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
