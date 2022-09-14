const hre = require("hardhat");

// npx hardhat run scripts/deploy.js --network rinkeby

// Contract address need for later : 0x059eC8751a957F55eF9D19565Ec4C760819414da 

async function main() {
  const profileImageMinterFactory = await hre.ethers.getContractFactory('ProfileImageNfts');
  const profileImageContract = await profileImageMinterFactory.deploy();

  await profileImageContract.deployed();

  console.log('Profile Image Minter COntract Deployed to : ', profileImageContract.address);
}

; (async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()