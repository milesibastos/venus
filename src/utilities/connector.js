import { UnsupportedChainIdError } from '@web3-react/core';
import { NoBscProviderError, BscConnector } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
  InjectedConnector
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from '@web3-react/walletconnect-connector';
import { loadState, saveState } from 'utilities/localStorage';
import {
  APP_CHAIN_ID,
  APP_RPC_URL,
  CONNECTOR_ERROR_MAP
} from 'utilities/constants';

export const getLocalConnectId = () => {
  const ls = loadState();
  return ls.account.setting.connectId;
};

export const setLocalConnectId = connectId => {
  const ls = loadState();
  ls.account.setting.connectId = connectId;
  saveState(ls);
};

const POLLING_INTERVAL = 12000;

export const ConnectorNames = {
  BSC: 'binance',
  INJECTED: 'metamask',
  WALLETCONNECT: 'walletconnect',
  UNKNOWN: 'unknown'
};

// variable read from env file is string, must converting
const APP_CHAIN_ID_NUM = Number(APP_CHAIN_ID);

export const connectorNameMap = {
  [ConnectorNames.INJECTED]: new InjectedConnector({
    supportedChainIds: [APP_CHAIN_ID_NUM]
  }),
  [ConnectorNames.WALLETCONNECT]: new WalletConnectConnector({
    rpc: { [APP_CHAIN_ID_NUM]: APP_RPC_URL },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
  }),
  [ConnectorNames.BSC]: new BscConnector({
    supportedChainIds: [APP_CHAIN_ID_NUM]
  })
};

// @todo: to get compatible with old logic of walletType, should be removed
export const getConnectorNameByConnector = connector => {
  if (connector instanceof WalletConnectConnector) {
    return ConnectorNames.WALLETCONNECT;
  }
  if (connector instanceof BscConnector) {
    return ConnectorNames.BSC;
  }
  if (connector instanceof InjectedConnector) {
    return ConnectorNames.INJECTED;
  }
  return ConnectorNames.UNKNOWN;
};

// convert connector error to our own error
export const convertError = (error, connector) => {
  if (error instanceof UnsupportedChainIdError) {
    return CONNECTOR_ERROR_MAP.UNSUPPORTED_CHAIN;
  }
  if (
    error instanceof NoEthereumProviderError ||
    error instanceof NoBscProviderError
  ) {
    return CONNECTOR_ERROR_MAP.MISSING_PROVIDER;
  }
  if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    if (connector instanceof WalletConnectConnector) {
      const walletConnector = connector;
      walletConnector.walletConnectProvider = null;
    }
    return CONNECTOR_ERROR_MAP.USER_REJECTED;
  }
  return CONNECTOR_ERROR_MAP.UNKNOWN;
};

export const convertErrorMessage = (error, connector) => {
  const errorCode = convertError(error, connector);
  switch (errorCode) {
    case CONNECTOR_ERROR_MAP.MISSING_PROVIDER: {
      return `We could not locate a supported web3 browser extension.`;
    }
    case CONNECTOR_ERROR_MAP.USER_REJECTED: {
      return `Please authorize Venus to access your account.`;
    }
    case CONNECTOR_ERROR_MAP.UNSUPPORTED_CHAIN: {
      return `Venus is only supported on Binance Smart Chain ${
        Number(APP_CHAIN_ID) === 97 ? 'Test' : ''
      } Network, please connect to the correct network.`;
    }
    default: {
      return `It seems like there is an unknown wallet issue`;
    }
  }
};
