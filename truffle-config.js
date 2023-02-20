const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
// const mnemonic = fs.readFileSync(".secret").toString().trim();
require("dotenv").config();

module.exports = {
  api_keys: {
    bscscan: "",
    polygonscan: "",
  },
  networks: {
    development: {
      provider: () => {
        return new HDWalletProvider("", "HTTP://172.17.128.1:7545");
      },
      // host: "localhost",     // Localhost (default: none)
      // port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    mumbai: {
      provider: () => {
        var wallet = new HDWalletProvider(process.env.MUMBAI_KEY, 'wss://ws-matic-mumbai.chainstacklabs.com')
        return wallet
      },
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false,
    },
    bsctestnet: {
      provider: () => {
        return new HDWalletProvider(`${process.env.BSCTESTNET_KEY}`, 'https://data-seed-prebsc-1-s2.binance.org:8545/')
      },
      network_id: 97,
      // confirmations: 2,
      // timeoutBlocks: 200,
      skipDryRun: true,
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(process.env.ROPSTEN_KEY, 'wss://ropsten.infura.io/ws/v3/f36c86581bc34486bca0a45a487b10a8')
      },
      network_id: 3,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false,
    },
    polygon: {
      provider: () => {
        return new HDWalletProvider(process.env.POLYGON_KEY, 'https://polygon-mainnet.infura.io/v3/9a6feb0c6140449c9997d5f98b2a3665')
      },
      network_id: 137,
      // confirmations: 2,
      timeoutBlocks: 200000,
      skipDryRun: true,
    },
    bsc: {
      provider: () => {
        return new HDWalletProvider(process.env.BSC_KEY, 'wss://bsc-ws-node.nariox.org:443')
      },
      network_id: 56,
      // confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ethereum: {
      provider: () => {
        return new HDWalletProvider(process.env.ETH_KEY, 'wss://mainnet.infura.io/ws/v3/f36c86581bc34486bca0a45a487b10a8')
      },
      network_id: 1,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      // maxPriorityFeePerGas: 2,
    },
    avalanche: {
      provider: () => {
        return new HDWalletProvider(process.env.AVAX_KEY, 'https://api.avax.network/ext/bc/C/rpc')
      },
      network_id: 43114,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false,
      maxPriorityFeePerGas: 2,
    },
    fantom: {
      provider: () => {
        return new HDWalletProvider(process.env.FTM_KEY, 'https://rpc.fantom.network')
      },
      network_id: 250,
      skipDryRun: true,
    },
    arbitrum: {
      provider: () => {
        return new HDWalletProvider(process.env.ARB_KEY, 'https://arb1.arbitrum.io/rpc')
      },
      network_id: 42161,
      skipDryRun: true,
    },
    heco: {
      provider: () => {
        return new HDWalletProvider(process.env.HT_KEY, 'https://http-mainnet.hecochain.com')
      },
      network_id: 128,
      skipDryRun: true,
    },
    harmony: {
      provider: () => {
        return new HDWalletProvider(process.env.ONE_KEY, 'https://api.harmony.one')
      },
      network_id: 1666600000,
      skipDryRun: false,
    },
  },
  plugins: ["solidity-coverage", "truffle-plugin-verify"],

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.4",
    },
  },
};
