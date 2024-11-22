const { db } = require('../database/firebase.database.js');
const { v4: uuidv4 } = require('uuid');

// Obtener un historial de servicio
exports.getServiceHistory = async (req, res) => {
  const { userId, vehicleId, serviceId } = req.params;

  try {
    const serviceRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('serviceHistory')
      .doc(serviceId);
    const doc = await serviceRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Service History not found' });
    }

    const serviceHistory = { serviceId: doc.id, ...doc.data() };
    return res.json(serviceHistory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getServiceHistoryByUser = async (req, res) => {
  const { userId, vehicleId } = req.params;

  try {
    const serviceRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('serviceHistory');

    const snapshot = await serviceRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Vehicle Services not found' });
    }

    const services = [];
    snapshot.forEach(doc => {
      services.push({ serviceId: doc.id, ...doc.data() });
    });

    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Agregar un nuevo historial de servicio
exports.addServiceHistory = async (req, res) => {
  const { userId, vehicleId } = req.params;
  const { serviceDate, serviceType, mileageAtService, cost, serviceCenter, notes } = req.body;
  const serviceId = uuidv4();

  try {
    const newServiceHistory = { serviceDate, serviceType, mileageAtService, cost, serviceCenter, notes };
    await db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('serviceHistory')
      .doc(serviceId)
      .set(newServiceHistory);

    return res.status(201).json({ serviceId, ...newServiceHistory });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar un historial de servicio
exports.updateServiceHistory = async (req, res) => {
  const { userId, vehicleId, serviceId } = req.params;
  const { serviceDate, serviceType, mileageAtService, cost, serviceCenter, notes } = req.body;

  try {
    const serviceRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('serviceHistory')
      .doc(serviceId);

    const doc = await serviceRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Service History not found' });
    }

    const updatedServiceHistory = { serviceDate, serviceType, mileageAtService, cost, serviceCenter, notes };
    await serviceRef.update(updatedServiceHistory);

    return res.json({ serviceId, ...updatedServiceHistory });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar un historial de servicio
exports.deleteServiceHistory = async (req, res) => {
  const { userId, vehicleId, serviceId } = req.params;

  try {
    const serviceRef = db.collection('users')
      .doc(userId)
      .collection('vehicles')
      .doc(vehicleId)
      .collection('serviceHistory')
      .doc(serviceId);

    const doc = await serviceRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Service History not found' });
    }

    await serviceRef.delete();
    return res.status(204).json({ message: 'Service History deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
