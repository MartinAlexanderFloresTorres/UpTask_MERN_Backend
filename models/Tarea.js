import mongoose from "mongoose";

// creamos la estructura de un Schema
const tareaSchema = mongoose.Schema(
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
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    prioridad: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
      required: true,
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  }
);

// definimos el modelo
const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
