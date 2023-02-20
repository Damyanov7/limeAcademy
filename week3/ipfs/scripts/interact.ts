import { NFT } from './../typechain-types/contracts/ipfs.sol/NFT';
import { ethers } from "hardhat";
const ipfs = require('../artifacts/contracts/ipfs.sol/NFT.json')

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your election contract address
  const balance = await wallet.getBalance();
  console.log("Current balance: " + ethers.utils.formatEther(balance, 18));

  const NFTContract = new ethers.Contract(contractAddress, ipfs.abi, wallet);

  const uri = "https://ipfs.io/ipfs/QmaMom7qp1ejC5jA8R3abiYN2aWx6SuWJC2WZwF6XULEyF";
  await NFTContract.safeMint(uri, wallet.address);

  const uriFromContract = await NFTContract.tokenURI(1);
  console.log("The toke URI is ", uriFromContract);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });