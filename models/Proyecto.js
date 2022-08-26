import mongoose from "mongoose";

// creamos la estructura de un Schema
const Proyectoschema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    tareas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tarea",
      },
    ],
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  }
);
// definimos el modelo
const Proyecto = mongoose.model("Proyecto", Proyectoschema);
export default Proyecto;
