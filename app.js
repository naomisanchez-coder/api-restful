const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Importamos el middleware de errores
const errorHandler = require("./middlewares/errorHandler");

// Importamos los módulos de rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

// Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada petición

// Rutas base
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

// Middleware Global de Manejo de Errores 
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});