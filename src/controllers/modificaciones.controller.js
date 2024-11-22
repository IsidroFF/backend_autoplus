const { db } = require('../database/firebase.database.js');
const { v4: uuidv4 } = require('uuid');

// Obtener una modificación de vehículo
exports.getVehicleModification = async (req, res) => {
  const { userId, vehicleId, modificationId } = req.params;

  try {
    const modificationRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('vehicleModifications')
      .doc(modificationId);
    const doc = await modificationRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle Modification not found' });
    }

    const modification = { modificationId: doc.id, ...doc.data() };
    return res.json(modification);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getVehicleModificationsByUser = async (req, res) => {
  const { userId, vehicleId } = req.params;

  try {
    const modificationRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('vehicleModifications');

    const snapshot = await modificationRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Vehicle Modifications not found' });
    }

    const modifications = [];
    snapshot.forEach(doc => {
      modifications.push({ modificationId: doc.id, ...doc.data() });
    });

    return res.json(modifications);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Crear una nueva modificación de vehículo
exports.addVehicleModification = async (req, res) => {
  const { userId, vehicleId } = req.params;
  const { modificationDate, modificationType, description, cost, mileageAtModification, performedBy, notes } = req.body;
  const modificationId = uuidv4();

  try {
    const newModification = { modificationDate, modificationType, description, cost, mileageAtModification, performedBy, notes };
    await db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('vehicleModifications')
      .doc(modificationId)
      .set(newModification);

    return res.status(201).json({ modificationId, ...newModification });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar una modificación de vehículo
exports.updateVehicleModification = async (req, res) => {
  const { userId, vehicleId, modificationId } = req.params;
  const { modificationDate, modificationType, description, cost, mileageAtModification, performedBy, notes } = req.body;

  try {
    const modificationRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('vehicleModifications')
      .doc(modificationId);

    const doc = await modificationRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle Modification not found' });
    }

    const updatedModification = { modificationDate, modificationType, description, cost, mileageAtModification, performedBy, notes };
    await modificationRef.update(updatedModification);

    return res.json({ modificationId, ...updatedModification });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar una modificación de vehículo
exports.deleteVehicleModification = async (req, res) => {
  const { userId, vehicleId, modificationId } = req.params;

  try {
    const modificationRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('vehicleModifications')
      .doc(modificationId);

    const doc = await modificationRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle Modification not found' });
    }

    await modificationRef.delete();
    return res.status(204).json({ message: 'Vehicle Modification deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
