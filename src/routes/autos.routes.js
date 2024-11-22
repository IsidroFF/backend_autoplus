const express = require('express');
const { getVehiclesByUser, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/autos.controller.js');

const router = express.Router();
    
router.get('/:userId/vehicles', getVehiclesByUser);
router.get('/:userId/vehicles/:vehicleId', getVehicleById);
router.post('/:userId/vehicles', createVehicle);
router.put('/:userId/vehicles/:vehicleId', updateVehicle);
router.delete('/:userId/vehicles/:vehicleId', deleteVehicle);

module.exports = router;
