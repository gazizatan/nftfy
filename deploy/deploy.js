const hre = require("hardhat");

async function main() {
    const MusicNFT = await hre.ethers.getContractFactory("MusicNFT");
    const musicNFT = await MusicNFT.deploy();

    await musicNFT.deployed();
    console.log("Contract deployed at:", musicNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
