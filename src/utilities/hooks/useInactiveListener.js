/* eslint-disable no-unused-expressions */
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

export function useInactiveListener({
  handleConnect,
  handleChainChanged,
  handleAccountsChanged,
  handleNetworkChanged
}) {
  const { active, error, activate } = useWeb3React();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error) {
      handleConnect && ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', chainId => {
        handleChainChanged && handleChainChanged(chainId);
      });
      handleAccountsChanged &&
        ethereum.on('accountsChanged', handleAccountsChanged);
      handleNetworkChanged &&
        ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          handleConnect && ethereum.removeListener('connect', handleConnect);
          handleChainChanged &&
            ethereum.removeListener('chainChanged', handleChainChanged);
          handleAccountsChanged &&
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
          handleNetworkChanged &&
            ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, activate]);
}
