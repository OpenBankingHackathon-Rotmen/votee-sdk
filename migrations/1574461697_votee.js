const Votee = artifacts.require("Votee");

module.exports = function(deployer) {
  deployer.deploy(Votee);
};
