const { success } = require("../utils/response");

function getProtected(req, res) {
  return success(res, {
    data: {
      authenticated: true
    },
    message: "Authorized"
  });
}

module.exports = {
  getProtected
};
