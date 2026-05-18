function success(res, { statusCode = 200, data = {}, message = "OK" }) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

function error(res, { statusCode = 500, message = "Internal server error", code = "INTERNAL_SERVER_ERROR" }) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code
    }
  });
}

module.exports = {
  success,
  error
};
