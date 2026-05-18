const { error } = require("../utils/response");

function requireAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const expectedToken = process.env.API_TOKEN || "api-quest-secret";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, {
      statusCode: 401,
      message: "Authorization token is required",
      code: "UNAUTHORIZED"
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return error(res, {
      statusCode: 401,
      message: "Authorization token is required",
      code: "UNAUTHORIZED"
    });
  }

  if (token !== expectedToken) {
    return error(res, {
      statusCode: 403,
      message: "Invalid token",
      code: "FORBIDDEN"
    });
  }

  return next();
}

module.exports = {
  requireAuth
};
