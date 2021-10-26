import React, { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import ConnectModal from './ConnectModal';

const ConnectButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    margin: 0;
  }

  .connect-btn {
    width: 114px;
    height: 30px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #f2c265, #f7b44f);

    @media only screen and (max-width: 768px) {
      width: 100px;
    }

    .MuiButton-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;

      @media only screen and (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
`;

function ConnectButton() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { account } = useWeb3React();

  const onClose = () => {
    setShowConnectModal(false);
  };

  const onOpen = () => {
    setShowConnectModal(true);
  };

  const handleCloseConnectModal = useCallback(
    type => {
      onClose();
    },
    [setShowConnectModal]
  );

  return (
    <ConnectButtonWrapper>
      <Button
        className="connect-btn"
        onClick={() => {
          onOpen();
        }}
      >
        {!account
          ? 'Connect'
          : `${account.substr(0, 6)}...${account.substr(
              account.length - 4,
              4
            )}`}
      </Button>
      <ConnectModal
        onClose={handleCloseConnectModal}
        visible={showConnectModal}
      />
    </ConnectButtonWrapper>
  );
}

export default ConnectButton;
