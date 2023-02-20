import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

const lazyImport = async (module: any) => {
  return (await import(module));
};

task("deploy", "Deploys contracts")
  .setAction(async () => {
    const { main } = await lazyImport("./scripts/ipfs");
    await main();
  });


export default config;
