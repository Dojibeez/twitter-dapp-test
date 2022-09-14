require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.2",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/8bwiRl8WwKcNuATQ-Z5zrKCrlOF8DUOU',
      accounts: [
        'a64e8ad072dd50a85e6fd0623c8534499739b09c9c9b59df177dae7042136911'
      ]
    }
  }
};
