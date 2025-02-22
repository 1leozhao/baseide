const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Based contract...");

  const Based = await ethers.getContractFactory("Based");
  const based = await Based.deploy();
  await based.waitForDeployment();

  console.log("Based deployed to:", await based.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 