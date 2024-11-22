const { db } = require('../database/firebase.database.js');
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = { userId: doc.id, ...doc.data() };
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  const userId = uuidv4();

  try {
    const newUser = { name, email, phoneNumber };
    await db.collection('users').doc(userId).set(newUser);
    res.status(201).json({ userId, ...newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ name, email, phoneNumber });
    res.json({ userId, name, email, phoneNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.collection('users').doc(userId).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
