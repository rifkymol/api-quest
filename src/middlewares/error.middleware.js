const { error } = require("../utils/response");

function errorMiddleware(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return error(res, {
      statusCode: 400,
      message: "Invalid JSON",
      code: "BAD_REQUEST"
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  return error(res, {
    statusCode,
    message: isServerError ? "Internal server error" : err.message,
    code: err.code || (isServerError ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST")
  });
}

module.exports = errorMiddleware;
