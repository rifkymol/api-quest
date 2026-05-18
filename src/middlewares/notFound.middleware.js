const { error } = require("../utils/response");

function notFoundMiddleware(req, res) {
  return error(res, {
    statusCode: 404,
    message: "Route not found",
    code: "NOT_FOUND"
  });
}

module.exports = notFoundMiddleware;
