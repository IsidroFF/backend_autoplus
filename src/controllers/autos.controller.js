// const { db, storage } = require('../database/firebase.database.js');
// const { v4: uuidv4 } = require('uuid');
// const multer = require('multer');
// const { getStorage } = require('firebase-admin/storage');

// // Configuración de multer
// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// // Middleware para manejar archivos
// exports.uploadVehicleImage = upload.single('image');

// // Obtener todos los vehículos de un usuario
// exports.getVehiclesByUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const vehiclesRef = db.collection('users').doc(userId).collection('vehicles');
//     const snapshot = await vehiclesRef.get();
//     const vehicles = snapshot.docs.map(doc => ({ vehicleId: doc.id, ...doc.data() }));
//     res.json(vehicles);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getVehicleById = async (req, res) => {
//   const { userId, vehicleId } = req.params;

//   try {
//     const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
//     const doc = await vehicleRef.get();

//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Vehicle not found' });
//     }

//     res.json({ vehicleId: doc.id, ...doc.data() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createVehicle = async (req, res) => {
//   const { userId } = req.params;
//   const { make, model, year, vin, licensePlate, mileage } = req.body;
//   const vehicleId = uuidv4();

//   try {
//     let imageUrl = null;

//     // Subir imagen si está presente
//     if (req.file) {
//       const bucket = getStorage().bucket();
//       const fileName = `vehicles/${vehicleId}-${req.file.originalname}`;
//       const file = bucket.file(fileName);

//       await file.save(req.file.buffer, {
//         metadata: {
//           contentType: req.file.mimetype,
//         },
//       });

//       // Obtener la URL pública
//       const [url] = await file.getSignedUrl({
//         action: 'read',
//         expires: '03-01-3000', // URL válida hasta el año 3000
//       });
//       imageUrl = url;
//     }

//     // Crear el objeto del vehículo
//     const newVehicle = { 
//       make, 
//       model, 
//       year, 
//       vin, 
//       licensePlate, 
//       mileage,
//       imageUrl,
//     };

//     // Guardar en Firestore
//     await db.collection('users').doc(userId).collection('vehicles').doc(vehicleId).set(newVehicle);

//     res.status(201).json({ vehicleId, ...newVehicle });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateVehicle = async (req, res) => {
//   const { userId, vehicleId } = req.params;
//   const { make, model, year, vin, licensePlate, mileage } = req.body;

//   try {
//     const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
//     await vehicleRef.update({ make, model, year, vin, licensePlate, mileage });
//     res.json({ vehicleId, make, model, year, vin, licensePlate, mileage });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteVehicle = async (req, res) => {
//   const { userId, vehicleId } = req.params;

//   try {
//     await db.collection('users').doc(userId).collection('vehicles').doc(vehicleId).delete();
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const { db, storage } = require('../database/firebase.database.js');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { getStorage } = require('firebase-admin/storage');

// Configuración de multer
const upload = multer({
  storage: multer.memoryStorage(),
});

// Middleware para manejar archivos
exports.uploadVehicleImage = upload.single('image');

// Obtener todos los vehículos de un usuario
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

// Obtener un vehículo específico por ID
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

// Crear un nuevo vehículo
exports.createVehicle = async (req, res) => {
  const { userId } = req.params;
  const { make, model, year, vin, licensePlate, mileage } = req.body;
  const vehicleId = uuidv4();

  try {
    let imageUrl = null;

    // Subir imagen si está presente
    if (req.file) {
      const bucket = getStorage().bucket();
      const fileName = `vehicles/${vehicleId}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Obtener la URL pública
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-3000', // URL válida hasta el año 3000
      });
      imageUrl = url;
    }

    // Crear el objeto del vehículo
    const newVehicle = { 
      make, 
      model, 
      year, 
      vin, 
      licensePlate, 
      mileage,
      imageUrl,
    };

    // Guardar en Firestore
    await db.collection('users').doc(userId).collection('vehicles').doc(vehicleId).set(newVehicle);

    res.status(201).json({ vehicleId, ...newVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un vehículo existente
exports.updateVehicle = async (req, res) => {
  const { userId, vehicleId } = req.params;
  const { make, model, year, vin, licensePlate, mileage } = req.body;

  try {
    const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
    const vehicleDoc = await vehicleRef.get();

    if (!vehicleDoc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicleData = vehicleDoc.data();
    let imageUrl = vehicleData.imageUrl; // Mantener la URL actual si no se proporciona una nueva imagen

    // Si se carga una nueva imagen
    if (req.file) {
      const bucket = getStorage().bucket();

      // Eliminar la imagen anterior si existe
      if (imageUrl) {
        const previousFileName = imageUrl.split('/').pop().split('?')[0]; // Extraer nombre del archivo
        await bucket.file(`vehicles/${previousFileName}`).delete().catch(() => {
          console.log("No se encontró la imagen anterior para eliminar.");
        });
      }

      // Subir nueva imagen
      const fileName = `vehicles/${vehicleId}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Obtener nueva URL pública
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-3000', // URL válida hasta el año 3000
      });
      imageUrl = url;
    }

    // Actualizar los datos del vehículo
    const updatedVehicle = { make, model, year, vin, licensePlate, mileage, imageUrl };
    await vehicleRef.update(updatedVehicle);

    res.json({ vehicleId, ...updatedVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un vehículo
exports.deleteVehicle = async (req, res) => {
  const { userId, vehicleId } = req.params;

  try {
    const vehicleRef = db.collection('users').doc(userId).collection('vehicles').doc(vehicleId);
    const vehicleDoc = await vehicleRef.get();

    if (!vehicleDoc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicleData = vehicleDoc.data();

    // Eliminar la imagen del almacenamiento si existe
    if (vehicleData.imageUrl) {
      const bucket = getStorage().bucket();
      const fileName = vehicleData.imageUrl.split('/').pop().split('?')[0]; // Extraer nombre del archivo
      await bucket.file(`vehicles/${fileName}`).delete().catch(() => {
        console.log("No se encontró la imagen para eliminar.");
      });
    }

    // Eliminar el documento del vehículo
    await vehicleRef.delete();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
