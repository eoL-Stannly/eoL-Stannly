import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy ExampleToken
  const ExampleToken = await ethers.getContractFactory("ExampleToken");
  const token = await ExampleToken.deploy(
    "Example Token",
    "EXT",
    deployer.address
  );

  await token.waitForDeployment();

  console.log("ExampleToken deployed to:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
