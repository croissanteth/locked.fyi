require('dotenv').config()
usePlugin('buidler-ethers-v5')
usePlugin('solidity-coverage')
// usePlugin('buidler-gas-reporter')
usePlugin('@nomiclabs/buidler-solhint')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('buidler-deploy')

const mnemonic = process.env.MNEMONIC

if (!mnemonic || mnemonic === '') {
  throw new Error(`environment variable "MNEMONIC" not configured `)
}

const accounts = mnemonic
  ? {
      mnemonic,
    }
  : undefined

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/459caf4344dc4bd8a235559b3c4ee972',
      accounts,
    },
  },
  solc: {
    version: '0.5.17',
    optimizer: {
      enabled: false,
      runs: 200,
    },
    evmVersion: 'istanbul',
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  gasReporter: {
    src: './contracts',
    enabled: false,
    currency: 'USD',
    excludeContracts: [],
    gasPrice: 5,
  },
  etherscan: {
    url: 'https://api-RINKEBY.etherscan.io/api',
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: '',
      4: process.env.DEPLOYER,
    },
    lock: {
      default: 1,
      1: '', // undeployed
      4: '0x2CD1EDd0f7F1C20c4892cDBD8700B93c23777989',
    },
    tokenManager: {
      default: 3,
      1: '', // undeployed
      4: '0x757734fbd72343dd73327e5a504acfe747eecdfd',
    },
    rewards: {
      default: 4,
      1: '', // undeployed
      4: '0x62206dc3e8698effd6Fb92b818EF428a2c9A05Ea',
    },
    miniMeToken: {
      default: 5,
      1: '', // undeployed
      4: '0xbba68d6db8fda871826bbc42ffdb3773bc7c4dd5',
    },
  },
}
