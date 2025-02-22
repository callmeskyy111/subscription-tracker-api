//Custom Global Error-Handler Middleware

export default function errorMiddleware(err, req, res, next) {
  console.error(err); // Log full error for debugging

  let error = err;

  // Default Error Message
  error.message = error.message || "An error occurred";
  error.statusCode = error.statusCode || 500;

  // CastError (Invalid MongoDB ID)
  if (err.name === "CastError") {
    error = new Error("Resource not found!");
    error.statusCode = 404;
  }

  // Duplicate Key Error (MongoDB Unique Field Violation)
  if (err.code === 11000) {
    error = new Error("Duplicate field value entered!");
    error.statusCode = 400;
  }

  // Validation Error (Mongoose Schema Validation)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new Error(messages.join(", "));
    error.statusCode = 400;
  }

  // Invalid Token (JWT Authentication)
  if (err.name === "JsonWebTokenError") {
    error = new Error("Invalid token. Please login again!");
    error.statusCode = 401;
  }

  // Unauthorized Access
  if (err.name === "UnauthorizedError") {
    error = new Error("Unauthorized access!");
    error.statusCode = 403;
  }

  // MongoDB Errors
  if (err.code && err.code >= 10000) {
    error = new Error("Database error: " + err.message);
    error.statusCode = 500;
  }

  // Send JSON response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
}
