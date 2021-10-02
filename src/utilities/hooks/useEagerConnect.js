import { useEffect } from 'react';
import useConnect, { getLocalConnectId, ConnectorNames } from './useConnect';

const binanceChainListener = async () =>
  new Promise(resolve =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc;
      },
      set(bsc) {
        this.bsc = bsc;

        resolve();
      }
    })
  );

const useEagerConnect = () => {
  const { connect } = useConnect();

  useEffect(() => {
    const connectorId = getLocalConnectId();

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC;
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain');

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        binanceChainListener().then(() => connect(connectorId));
        return;
      }

      connect(connectorId);
    }
  }, [connect]);
};

export default useEagerConnect;
