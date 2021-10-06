import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { setupNetwork } from 'utilities/common';
import {
  connectorNameMap,
  setLocalConnectId,
  ConnectorNames
} from 'utilities/connector';

export const useConnect = () => {
  const { chainId, activate, deactivate } = useWeb3React();

  const connect = useCallback(
    connectorID => {
      const connector = connectorNameMap[connectorID];
      if (connector) {
        activate(connector, async error => {
          if (!error) {
            setLocalConnectId(connectorID);
          }
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector);
            }
          } else {
            setLocalConnectId('');
          }
        });
      }
    },
    [activate]
  );

  const disconnect = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorNameMap[ConnectorNames.WALLETCONNECT].walletconnect.close();
      connectorNameMap[
        ConnectorNames.WALLETCONNECT
      ].walletconnect.walletConnectProvider = null;
    }
    setLocalConnectId('');
  }, [deactivate, chainId]);

  return { connect, disconnect };
};
