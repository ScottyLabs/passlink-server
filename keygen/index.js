const NodeRSA = require("node-rsa");

module.exports = function () {
  const key = new NodeRSA({ b: 2048 });
  return {
    public: key.exportKey("public"),
    private: key.exportKey("private"),
  };
};
