require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Подключаем dotenv для работы с переменными окружения

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.28" }, // Для Lock.sol
      { version: "0.8.2" }   // Для MusicNFT.sol
    ]
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_URL,  // URL RPC из Alchemy
      accounts: [process.env.PRIVATE_KEY] // Приватный ключ из .env
    }
  }
};
