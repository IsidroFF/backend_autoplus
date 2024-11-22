const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/usuarios.routes.js');
const vehicleRoutes = require('./routes/autos.routes.js');
const serviceHistoryRoutes = require('./routes/servicio.routes.js');
const vehicleModificationRoutes = require('./routes/modificaciones.routes.js');
const loginRoutes = require('./routes/login.routes.js');
const registerRoutes = require('./routes/register.routes.js')

const app = express();
app.use(bodyParser.json());

// Configurar rutas
app.use('/users', userRoutes);
app.use('/users', vehicleRoutes);
app.use('/users', serviceHistoryRoutes);
app.use('/users', vehicleModificationRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

module.exports = app;
