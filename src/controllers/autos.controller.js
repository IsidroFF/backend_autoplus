const { db } = require('../database/firebase.database.js');
const { v4: uuidv4 } = require('uuid');

exports.getVehiclesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const vehiclesRef = db.collection('users').doc(userId).collection('vehicles');
    const snapshot = await vehiclesRef.get();
    const vehicles = snapshot.docs.map(doc => ({ vehicleId: doc.id, ...doc.data() }));
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  const { userId, vehicleId } = req.params;

  try {
    const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
    const doc = await vehicleRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ vehicleId: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  const { userId } = req.params;
  const { make, model, year, vin, licensePlate, mileage } = req.body;
  const vehicleId = uuidv4();

  try {
    const newVehicle = { make, model, year, vin, licensePlate, mileage };
    await db.collection('users').doc(userId).collection('vehicles').doc(vehicleId).set(newVehicle);
    res.status(201).json({ vehicleId, ...newVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  const { userId, vehicleId } = req.params;
  const { make, model, year, vin, licensePlate, mileage } = req.body;

  try {
    const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
    await vehicleRef.update({ make, model, year, vin, licensePlate, mileage });
    res.json({ vehicleId, make, model, year, vin, licensePlate, mileage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { userId, vehicleId } = req.params;

  try {
    await db.collection('users').doc(userId).collection('vehicles').doc(vehicleId).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
