import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { setupNetwork } from 'utilities/common';
import {
  connectorNameMap,
  setLocalConnectId,
  ConnectorNames,
  convertErrorMessage
} from 'utilities/connector';
import toast from 'components/Basic/Toast';

export const useConnect = () => {
  const { chainId, activate, deactivate, setError } = useWeb3React();

  const connect = useCallback(
    connectorID => {
      const connector = connectorNameMap[connectorID];
      if (connector) {
        console.log('====== connecting to', connector)
        activate(connector, async error => {
          setError(error);
          console.log(`====== connect error`, error);
          if (!error) {
            setLocalConnectId(connectorID);
            toast.dismiss();
          } else {
            toast.error({
              title: convertErrorMessage(error, connector)
            });
          }
          if (
            error instanceof UnsupportedChainIdError &&
            connectorID === ConnectorNames.INJECTED
          ) {
            const hasSetup = await setupNetwork();
            console.log('====== hasSetup', hasSetup)
            if (hasSetup) {
              activate(connector, error => {
                setError(error);
                console.log(`==== connect error after setup`, error);
              });
            }
          } else {
            setLocalConnectId('');
          }
        });
      }
    },
    [activate, chainId]
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
