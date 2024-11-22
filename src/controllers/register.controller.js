const { auth, db } = require('../database/firebase.database.js');

exports.registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    //! Crear el usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    //! Guardar el usuario en Firestore
    const newUser = {
      uid: userRecord.uid,
      name,
      email,
      phoneNumber: phoneNumber || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(userRecord.uid).set(newUser);

    //! Responder con éxito
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: error.message });
  }
};
