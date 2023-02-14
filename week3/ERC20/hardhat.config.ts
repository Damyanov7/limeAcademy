import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

const lazyImport = async (module: any) => {
  return (await import(module));
};

task("deploy", "Deploys contracts")
  .setAction(async () => {
    const { main } = await lazyImport("./scripts/deploy-my");
    await main();
  });

task("deploy-with-pk", "Deploys contracts")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({ privateKey }) => {
    const { main } = await lazyImport("./scripts/deploy-with-pk");
    await main(privateKey);
  });

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Goerli Testnet
    goerli: {
      url: `https://goerli.infura.io/v3/a68b1888eded486f9b656e08f5db1610`,
      chainId: 5,
      accounts: [
        `32eb75bddc05680c9b134e112f03795bfac04c215f942b52e853ca24447b7a0f`,
      ],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at <https://etherscan.io/>
    apiKey: "CHIRAADNUI814XIT9ST36R63UFNBNDKBDY"
  }
};

export default config;
