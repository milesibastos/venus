import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
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
import { APP_CHAIN_ID, APP_RPC_URL } from 'utilities/constants';

// import { useAppDispatch } from 'state'

// connectors
const POLLING_INTERVAL = 12000;

const ConnectorNames = {
  BSC: 'bsc',
  INJECTED: 'injected',
  WALLETCONNECT: 'wallectconnect'
};

export const connectorNameMap = {
  [ConnectorNames.INJECTED]: new InjectedConnector({
    supportedChainIds: [APP_CHAIN_ID]
  }),
  [ConnectorNames.WALLETCONNECT]: new WalletConnectConnector({
    rpc: { [APP_CHAIN_ID]: APP_RPC_URL },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
  }),
  [ConnectorNames.BSC]: new BscConnector({ supportedChainIds: [APP_CHAIN_ID] })
};

export const getLocalConnectId = () => {
  const ls = loadState();
  return ls.account.setting.connectId;
};

export const setLocalConnectId = connectId => {
  const ls = loadState();
  ls.account.setting.connectId = connectId;
  saveState(ls);
};

export const useConnect = () => {
  const { chainId, activate, deactivate } = useWeb3React();

  const connect = useCallback(
    connectorID => {
      const connector = connectorNameMap[connectorID];
      if (connector) {
        activate(connector, async error => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector);
            }
          } else {
            setLocalConnectId('');
            if (
              error instanceof NoEthereumProviderError ||
              error instanceof NoBscProviderError
            ) {
              toastError(t('Provider Error'), t('No provider was found'));
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector;
                walletConnector.walletConnectProvider = null;
              }
              toastError(
                t('Authorization Error'),
                t('Please authorize to access your account')
              );
            } else {
              toastError(error.name, error.message);
            }
          }
        });
      } else {
        toastError(
          t('Unable to find connector'),
          t('The connector config is wrong')
        );
      }
    },
    [t, activate, toastError]
  );

  const disconnect = useCallback(() => {
    dispatch(profileClear());
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
    }
    window.localStorage.removeItem(connectorLocalStorageKey);
  }, [deactivate, dispatch, chainId]);

  return { connect, disconnect };
};
