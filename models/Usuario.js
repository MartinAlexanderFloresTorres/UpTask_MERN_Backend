import mongoose from "mongoose";
import bcrypt from "bcrypt";

// creamos la estructura de un Schema
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  }
);

// hashear los password con el hook de pre de mongoose
usuarioSchema.pre("save", async function (next) {
  // si esta modificado el password que pase a la siguiente Middleware
  if (!this.isModified("password")) next();

  const sal = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, sal);
});

// Comprobar password es verdadero mediante una nueva función
usuarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

// definimos el modelo
const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
