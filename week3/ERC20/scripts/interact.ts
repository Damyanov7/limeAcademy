import { ethers } from "hardhat";

async function main() {

    const ETHWrapperFactory = await ethers.getContractFactory("ETHWrapper");
    //const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    //const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const provider = new ethers.providers.InfuraProvider("goerli", "a68b1888eded486f9b656e08f5db1610");
    const wallet = new ethers.Wallet("32eb75bddc05680c9b134e112f03795bfac04c215f942b52e853ca24447b7a0f", provider);
    let balance = await wallet.getBalance();
    // console.log(balance.toString())
    
    const wrapValue = ethers.utils.parseEther("0.003")

    const ETHWrapperContract = await ETHWrapperFactory.attach("0x2440d506CB933882BcE3b2044c7dc4b4f22923A6");

    console.log(ETHWrapperContract.address)  

    const WETHFactory = await ethers.getContractFactory("WETH");
    const wethAddress = await ETHWrapperContract.WETHToken();
    const WETHContract = await WETHFactory.attach(wethAddress)

    let contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    console.log("Contract ETH balance before wrapping:", contractETHBalance.toString());
    const tx = await ETHWrapperContract.wrap({value: wrapValue});
    await tx.wait();
    // const tx2 = await ETHWrapperContract.wrap({value: wrapValue});
    // await tx2.wait();
    let contractETHBalance2 = await provider.getBalance(ETHWrapperContract.address);
    console.log("Contract ETH balance after wrapping:", contractETHBalance2.toString());


    const approveTx = await WETHContract.approve(ETHWrapperContract.address, wrapValue)
    await approveTx.wait()
    
    const unwrapTx = await ETHWrapperContract.unwrap(wrapValue)
    await unwrapTx.wait()
    
    balance = await WETHContract.balanceOf(wallet.address)
    console.log("Balance after unwrapping:", balance.toString())
    
    contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });