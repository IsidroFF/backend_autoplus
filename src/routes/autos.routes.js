const express = require('express');
const { getVehiclesByUser, getVehicleById, createVehicle, uploadVehicleImage, updateVehicle, deleteVehicle } = require('../controllers/autos.controller.js');

const router = express.Router();
    
router.get('/:userId/vehicles', getVehiclesByUser);
router.get('/:userId/vehicles/:vehicleId', getVehicleById);
router.post('/:userId/vehicles', uploadVehicleImage, createVehicle);
router.put('/:userId/vehicles/:vehicleId', uploadVehicleImage, updateVehicle);
router.delete('/:userId/vehicles/:vehicleId', deleteVehicle);

module.exports = router;
