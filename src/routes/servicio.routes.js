const express = require('express');
const { 
  getServiceHistory, 
  getServiceHistoryByUser,
  addServiceHistory, 
  updateServiceHistory, 
  deleteServiceHistory 
} = require('../controllers/servicio.controller.js');

const router = express.Router();

// Obtener todos los historiales de servicio
router.get('/:userId/vehicles/:vehicleId/serviceHistory', getServiceHistoryByUser);

// Obtener un historial de servicio
router.get('/:userId/vehicles/:vehicleId/serviceHistory/:serviceId', getServiceHistory);

// Crear un nuevo historial de servicio
router.post('/:userId/vehicles/:vehicleId/serviceHistory', addServiceHistory);

// Actualizar un historial de servicio
router.put('/:userId/vehicles/:vehicleId/serviceHistory/:serviceId', updateServiceHistory);

// Eliminar un historial de servicio
router.delete('/:userId/vehicles/:vehicleId/serviceHistory/:serviceId', deleteServiceHistory);

module.exports = router;
