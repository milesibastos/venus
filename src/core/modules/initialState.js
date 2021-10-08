const auth = {
  user: null
};

const account = {
  setting: {
    selectedAddress: null,
    marketType: 'supply',
    borrowMarket: [],
    supplyMarket: [],
    latestBlockNumber: '',
    decimals: {},
    assetList: [],
    totalBorrowBalance: '0',
    totalBorrowLimit: '0',
    walletType: 'metamask',
    pendingInfo: {
      type: '',
      status: false,
      amount: 0,
      symbol: ''
    },
    vaultVaiStaked: null,
    withXVS: true,
    markets: [],
    // we need chainid to identify if we are at the correct network
    chainId: 0
  }
};
export const initialState = {
  auth,
  account
};
