import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  // [ChainId.MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.MAINNET]: 'https://speedy-nodes-nyc.moralis.io/cfe9228e4c2f75a9e06337c7/bsc/testnet',
  // [ChainId.TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  [ChainId.TESTNET]: 'https://speedy-nodes-nyc.moralis.io/cfe9228e4c2f75a9e06337c7/bsc/testnet',
}

export default NETWORK_URLS
