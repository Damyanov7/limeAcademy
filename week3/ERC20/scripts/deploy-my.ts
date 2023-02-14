import { ethers } from "hardhat";

export async function main() {
  const ETHWrapperFactory = await ethers.getContractFactory("ETHWrapper"); // 
  const ETHWrapperContract = await ETHWrapperFactory.deploy();
  console.log('Waiting for ETHWrapperContract deployment... ', ETHWrapperContract.address);
  await ETHWrapperContract.deployed();
}