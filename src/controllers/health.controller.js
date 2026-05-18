const { success } = require("../utils/response");

function getHealth(req, res) {
  return success(res, {
    data: { status: "ok" },
    message: "Service is healthy"
  });
}

module.exports = {
  getHealth
};
