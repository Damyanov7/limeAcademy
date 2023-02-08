import { ethers } from "hardhat";

export async function main(_privateKey) {
    const deployer = new ethers.Wallet(_privateKey, ethers.provider);
  
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Library");
    const token = await Token.connect(deployer).deploy();
  
    console.log("Token address:", token.address);
}
  
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });