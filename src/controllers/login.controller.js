const { auth } = require('../database/firebase.database.js');

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  try {
    // Obtener información del usuario por correo
    const user = await auth.getUserByEmail(email);

    // Crear un token personalizado (si se requiere autenticación avanzada)
    const customToken = await auth.createCustomToken(user.uid);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      uid: user.uid
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(401).json({ message: 'Credenciales inválidas o usuario no encontrado.' });
  }
};
