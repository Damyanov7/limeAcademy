import { ethers } from "hardhat";

export async function main() {
  const IpfsFactory = await ethers.getContractFactory("NFT"); // 
  const IpfsContract = await IpfsFactory.deploy();
  console.log('Waiting for IPFScontract deployment... ', IpfsContract.address);
  await IpfsContract.deployed();
}
