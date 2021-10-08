import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import * as constants from 'utilities/constants';
import metamaskImg from 'assets/img/metamask.png';
import ledgerImg from 'assets/img/ledger.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';
import { useWeb3React } from '@web3-react/core';
import { useConnect } from 'utilities/hooks/useConnect';
// @todo: recompose style component should be removed in the future
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { compose } from 'recompose';

import {
  connectorNameMap,
  ConnectorNames,
  convertError
} from 'utilities/connector';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .header-content {
    width: 100%;
    margin-top: 60px;
    .logo-image {
      width: 153px;
      height: 34px;
      margin-bottom: 43px;
    }
    .title {
      font-size: 24.5px;
      color: var(--color-text-main);
    }

    .back-btn {
      width: 100%;
      padding: 10px 30px;
      img {
        transform: rotate(180deg);
        margin-right: 10px;
      }
      span {
        color: var(--color-white);
        font-size: 20px;
      }
    }
  }
  .connect-wallet-content {
    width: 100%;
    padding: 38px 78px 32px 66px;

    .metamask-connect-btn,
    .wallet-connect-btn,
    .ledger-connect-btn {
      width: 100%;
      cursor: pointer;
      padding: 27px 0px;

      & > div {
        img {
          width: 45px;
          margin-right: 44px;
        }
        span {
          color: var(--color-text-main);
          font-weight: normal;
          font-size: 17px;
        }
      }

      span {
        color: var(--color-text-secondary);
        font-weight: normal;
        font-size: 17px;
      }
    }

    .coinbase-connect-btn,
    .ledger-connect-btn {
      border-bottom: 1px solid var(--color-bg-active);
    }

    .metamask-status {
      margin-top: 20px;
      background-color: rgba(255, 0, 0, 0.03);
      padding: 5px 10px;
      border-radius: 4px;
      color: var(--color-red);
      a {
        margin-left: 5px;
      }
    }
  }

  .terms-of-use {
    font-size: 13.5px;
    color: var(--color-text-secondary);
    margin-bottom: 32px;
    a {
      color: var(--color-orange);
      margin-left: 11px;
    }
  }
`;

// close modal when address change/history change
function ConnectModal({ visible, onCancel, setSetting }) {
  const { connect } = useConnect();

  const [currentConnector, setCurrentConnector] = useState(undefined);
  const [activatingConnector, setActivatingConnector] = useState(undefined);
  const { error, account, connector, chainId } = useWeb3React();

  useEffect(() => {
    // @todo: walletType should be deprecated, we should use chainId instead
    const walletType = '';
    setCurrentConnector(connector);
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
    setSetting({
      selectedAddress: account,
      walletType,
      waiting: false
    });
  }, [connector, account, error, chainId]);

  const getStatusComponent = () => {
    // connector is switching
    const isConnecting = currentConnector !== activatingConnector;
    if (isConnecting) {
      return <span>Connecting to account...</span>;
    }
    const errorCode = convertError(error);
    const { CONNECTOR_ERROR_MAP } = constants;
    switch (errorCode) {
      case CONNECTOR_ERROR_MAP.MISSING_PROVIDER: {
        return (
          <p className="center">
            We could not locate a supported web3 browser extension. We recommend
            using MetaMask.
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download MetaMask here.
            </a>
          </p>
        );
      }
      case CONNECTOR_ERROR_MAP.USER_REJECTED: {
        return (
          <span>Please authorize this website to access your account.</span>
        );
      }
      case CONNECTOR_ERROR_MAP.UNSUPPORTED_CHAIN: {
        return <span>You are connected to an unsupported chain.</span>;
      }
      default: {
        return null;
      }
    }
  };

  function handleConnectWallet(connectorName) {
    const connectorByName = connectorNameMap[connectorName];
    if (!connectorByName) {
      throw new Error(`unsupported connector`);
    }
    setActivatingConnector(connectorNameMap[ConnectorNames.INJECTED]);
    connect(connectorName);
  }

  return (
    <Modal
      className="connect-modal"
      width={532}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <div className="flex flex-column align-center just-center header-content">
          <img src={logoImg} alt="logo" className="logo-image" />
          <p className="title">Connect to start using Venus</p>
        </div>
        <div className="connect-wallet-content">
          {/* ledger not supported */}
          <div className="flex align-center just-between ledger-connect-btn">
            <div className="flex align-center">
              <img src={ledgerImg} alt="ledger" />
              <span>Ledger</span>
            </div>
            <span>Coming Soon</span>
          </div>
          {[
            ConnectorNames.INJECTED,
            ConnectorNames.BSC,
            ConnectorNames.WALLETCONNECT
          ].map(connectorName => {
            return (
              <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={() => handleConnectWallet(connectorName)}
              >
                <div className="flex align-center" key={connectorName}>
                  <img src={metamaskImg} alt="metamask" />
                  <span>{connectorName}</span>
                </div>
                <img src={arrowRightImg} alt="arrow" />
              </div>
            );
          })}
          {getStatusComponent()}
        </div>
        <p className="center terms-of-use">
          <span>By connecting, I accept Venus&lsquo;s</span>
          <a href="https://www.swipe.io/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </p>
      </ModalContent>
    </Modal>
  );
}

ConnectModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

ConnectModal.defaultProps = {
  visible: false,
  onCancel: () => {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  ConnectModal
);
