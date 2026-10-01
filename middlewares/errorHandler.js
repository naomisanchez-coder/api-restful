const errorHandler = (err, req, res, next) => {
  console.error(" Error capturado por Middleware Global:", err.stack);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    error: true,
    message: err.message || "Ocurrió un error interno en el servidor"
  });
};

module.exports = errorHandler;