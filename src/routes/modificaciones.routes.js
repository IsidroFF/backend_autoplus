const express = require('express');
const { 
  getVehicleModification, 
  getVehicleModificationsByUser,
  addVehicleModification, 
  updateVehicleModification, 
  deleteVehicleModification 
} = require('../controllers/modificaciones.controller.js');

const router = express.Router();

// Obtener todas las modificiones de un vehículo
router.get('/:userId/vehicles/:vehicleId/vehicleModifications', getVehicleModificationsByUser);

// Obtener una modificación de vehículo
router.get('/:userId/vehicles/:vehicleId/vehicleModifications/:modificationId', getVehicleModification);

// Crear una nueva modificación de vehículo
router.post('/:userId/vehicles/:vehicleId/vehicleModifications', addVehicleModification);

// Actualizar una modificación de vehículo
router.put('/:userId/vehicles/:vehicleId/vehicleModifications/:modificationId', updateVehicleModification);

// Eliminar una modificación de vehículo
router.delete('/:userId/vehicles/:vehicleId/vehicleModifications/:modificationId', deleteVehicleModification);

module.exports = router;
