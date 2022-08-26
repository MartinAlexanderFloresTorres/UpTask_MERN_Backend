import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

// REGISTRAR A LOS USUARIOS
const registrar = async (req, res) => {
  // parametros requeridos { nombre, password, email }
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  // verifica si el email existe
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body); // crea un usuario
    usuario.token = generarId(); // generamos el token id
    await usuario.save(); // almacena el usuario
    // Enviar del email de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({
      msg: "Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

// AUTENTICAR A LOS USUARIOS
const auntenticar = async (req, res) => {
  // Comprobar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar su password del usuario
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

// CONFIRMAR A LAS CUENTAS
const confirmar = async (req, res) => {
  const { token } = req.params; // acceder al token
  // Comprobar si el usuario existe
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no Válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = "";
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    return res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

// RECUPERAR PASSWORD
const olvidePassword = async (req, res) => {
  // Comprobar si el usuario existe
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    // Enviar el email
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({ msg: "Hemos enviado un email con las instruciones" });
  } catch (error) {
    console.log(error);
  }
};

// VALIDAR TOKEN
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token Válido y el usuario existe" });
  } else {
    const error = new Error("Token no Válido");
    return res.status(403).json({ msg: error.message });
  }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
  // Comprobar si el usuario existe
  const { email } = req.usuario;
  const { nombre, password, passwordNuevo } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar su password del usuario
  if (await usuario.comprobarPassword(password)) {
    if (passwordNuevo) {
      usuario.password = passwordNuevo;
    }
    if (nombre) {
      usuario.nombre = nombre;
    }

    await usuario.save();
    if (passwordNuevo && nombre === usuario.nombre) {
      res.json({ msg: "Password a sido modificado correctamente" });
    } else {
      res.json({ msg: "Su nombre ha sido actualizado correctamente" });
    }
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    try {
      usuario.password = password;
      usuario.token = "";
      await usuario.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no Válido");
    return res.status(403).json({ msg: error.message });
  }
};

// OBTENER PERFIL
const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};
export {
  registrar,
  auntenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  actualizarPerfil,
};
