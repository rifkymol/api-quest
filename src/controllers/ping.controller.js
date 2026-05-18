const { success } = require("../utils/response");

function getPing(req, res) {
  return success(res, {
    data: { pong: true },
    message: "pong"
  });
}

module.exports = {
  getPing
};
