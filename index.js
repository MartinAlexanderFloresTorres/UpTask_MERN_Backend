import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRouters from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";

// Instanciando express
const app = express();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};
app.use(cors(corsOption));

// Procesar la informacion de tipo JSON
app.use(express.json());

// Configurando variables de entorno
dotenv.config();

// Contectando db
conectarDB();

// Definiendo el Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRouters);
app.use("/api/tareas", tareaRoutes);

// Definiendo PORT
const PORT = process.env.PORT || 4000;

// Arrancando el servidor
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // Definir los eventos de socket.io

  // RECIBIMOS EL EVENTOS DE ABRIR PROYECTO
  socket.on("abrir-proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  // RECIBIMOS EL EVENTOS DE NUEVA TAREA
  socket.on("nueva-tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea-agregada", tarea);
  });

  // RECIBIMOS EL EVENTO DE ELIMINAR TAREA
  socket.on("eliminar-tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea-eliminada", tarea);
  });

  // RECIBIMOS EL EVENTO DE ACTUALIZAR TAREA
  socket.on("actualizar-tarea", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("tarea-actualizada", tarea);
  });

  // RECIBIMOS EL EVENTOS DE CAMBIAR ESTADO
  socket.on("cambiar-estado", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("estado-cambiado", tarea);
  });
});
