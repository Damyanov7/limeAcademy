const { ethers } = require("ethers");
const USElection = require('./USElection.json')

const run = async function() {
const provider = new ethers.providers.InfuraProvider("goerli", "40c2813049e44ec79cb4d7e0d18de173")

const wallet = new ethers.Wallet("0x32eb75bddc05680c9b134e112f03795bfac04c215f942b52e853ca24447b7a0f", provider)
//const balance = await wallet.getBalance();

const electionContract = new ethers.Contract("0xb48fC7095dbDf00ea6d399a9fc5D74EE41ccfAAf", USElection.abi, wallet)

// const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);
// console.log("State Result Submission Transaction:", transactionOhio.hash);
// const transactionReceipt = await transactionOhio.wait();
// if (transactionReceipt.status != 1) {
// console.log("Transaction was not successful")
// return 
// }

// const currentLeader = await electionContract.currentLeader();
// console.log("Current leader", currentLeader);
// }

run()