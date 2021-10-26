import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import commaNumber from 'comma-number';
import NumberFormat from 'react-number-format';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { connectAccount, accountActionCreators } from 'core';
// import {
//   getTokenContract,
//   getComptrollerContract
// } from '../utilities/contractHelpers';
import MainLayout from 'containers/Layout/MainLayout';
import vrtImg from 'assets/img/coins/vrt.png';
import xvsImg from 'assets/img/coins/xvs.png';
import RedeemConfirmModal from 'components/VRT/RedeemConfirmModal';
import RedeemSuccessModal from 'components/VRT/RedeemSuccessModal';
import ConnectModal from '../../components/Basic/ConnectModal';

const commaFormater = commaNumber.bindWith(',', '.');

const VRTLayout = styled.div`
  .main-content {
    width: 100%;
    height: 100%;
  }
`;
const VRTWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .vrt-row {
    width: 100%;
  }
  .redeem-container {
    max-width: 679px;
  }
  @media only screen and (min-width: 1200px) {
    .redeem-container {
      width: 679px;
    }
  }
  .title {
    color: var(--color-text-main);
    line-height: 47px;
    font-size: 40px;
    margin-bottom: 40px;
  }
  .redeem-section {
    /* width: 679px; */
    height: 574px;
    background-color: var(--color-bg-primary);
    border-radius: 8px;
    padding: 80px 20px 0 20px;
  }
  .redeem-section-title {
    font-size: 16px;
    line-height: 19px;
    color: #fff;
    margin-bottom: 12px;
  }
  .redeem-section-subtitle {
    font-size: 14px;
    line-height: 16px;
    color: #76808f;
    margin-bottom: 40px;
  }
  .redeem-section-amount {
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    margin-bottom: 8px;
  }
  .redeem-section-amount-subtitle {
    font-size: 12px;
    line-height: 14px;
    color: #a1a1a1;
    margin-bottom: 40px;
  }
  /* redeem input and output */
  .redeem-details-container {
    width: 340px;
    margin-bottom: 24px;
  }
  .redeem-details-input-row {
    padding: 12px;
    background-color: #090e25;
    border-radius: 8px;
    margin-bottom: 4px;
    border: 1px solid transparent;
  }
  .redeem-details-input-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .redeem-details-input-input {
    flex: 1;
    background-color: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 14px;
    line-height: 16px;
  }
  .redeem-details-input-input:focus {
    outline: none;
  }
  .redeem-details-input-error {
    border: 1px solid #f90531;
  }
  .redeem-details-input-title {
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    margin-bottom: 6px;
  }
  .max-button {
    background-color: #ebbf6e;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .redeem-details-input-text {
    width: 39px;
    height: 24px;
    color: #fff;
    font-size: 12px;
    line-height: 24px;
  }
  .redeem-details-input-error-text {
    font-size: 12px;
    line-height: 14px;
    color: #f90531;
    margin-bottom: 24px;
    margin-top: 4px;
  }
  .redeem-details-input-desc {
    font-size: 12px;
    line-height: 14px;
    color: #757575;
  }
  .redeem-button {
    color: #fff;
    background-color: #ebbf6e;
    width: 340px;
    border-radius: 8px;
    line-height: 36px;
    cursor: pointer;
  }
`;

// @todo: integrate contracts
const formatNextCircleString = () => {
  return `2021-11-11`;
};

function VRT({ settings, setSetting }) {
  const [redeemRatio, setRedeemRatio] = useState(new BigNumber(1));
  const [redeemableAmount, setRedeemableAmount] = useState(new BigNumber(0));
  const [nextCircle, setNextCircle] = useState(0);
  const [inputValid, setInputValid] = useState(true);
  const [inputAmount, setInputAmount] = useState(new BigNumber(0));
  const [userVRTBalance, setUserVRTBalance] = useState(new BigNumber(0));
  // modals
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [txHash, setTxHash] = useState('');
  // wallet connect button
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { account } = useWeb3React();

  const onClose = () => {
    setShowConnectModal(false);
  };

  // @todo: to be replaced by send tx
  const confirmRedeem = async () => {
    return Promise.resolve()
      .then(() => {
        setIsConfirmModalVisible(false);
        setIsSuccessModalVisible(true);
        setTxHash(
          '0x389966bba2b6aed04b74e7d5396c14bfa5619d2b72edfccf3d963d4cbf00f459'
        );
      })
      .catch(() => {
        setIsConfirmModalVisible(false);
      });
  };

  const getVRTInfo = async () => {
    // total info
    setRedeemRatio(new BigNumber(0.8998));
    setNextCircle(10000000000);
    setRedeemableAmount(new BigNumber(1122334455));
    setUserVRTBalance(new BigNumber(100.12));
  };

  useEffect(() => {
    if (settings.markets) {
      getVRTInfo();
    }
  }, [settings.markets]);

  useEffect(() => {
    setInputValid(!inputAmount.gt(userVRTBalance));
  }, [inputAmount]);

  return (
    <VRTLayout>
      <MainLayout title="">
        <VRTWrapper>
          <Row className="vrt-row flex flex-center align-center just-center">
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
              className="redeem-container"
            >
              <div className="title center">Redeem VRT</div>
              <div className="redeem-section flex align-center flex-column">
                <div className="redeem-section-title center">
                  Redeem your VRT at 1VRT = {redeemRatio.toFixed(8)} XVS
                </div>
                <div className="redeem-section-subtitle center">
                  Each cycle will provide 100,000 XVS to provide redemption.
                  Next cycle in {formatNextCircleString(nextCircle)}
                </div>
                <div className="redeem-section-amount center">
                  {commaFormater(redeemableAmount.toFixed(2))} XVS
                </div>
                <div className="redeem-section-amount-subtitle center">
                  Curent XVS Available
                </div>
                {/* redeem inputs */}
                <div className="redeem-details-container flex flex-column">
                  <p className="redeem-details-input-title">Send VRT</p>
                  <div
                    className={`redeem-details-input-row flex align-center ${!inputValid &&
                      'redeem-details-input-error'}`}
                  >
                    <img
                      className="redeem-details-input-icon"
                      src={vrtImg}
                      alt="vrt"
                    />
                    <NumberFormat
                      className="redeem-details-input-input"
                      autoFocus
                      value={
                        inputAmount.isZero() ? '0' : inputAmount.toString(10)
                      }
                      onValueChange={values => {
                        const { value } = values;
                        setInputAmount(
                          value ? new BigNumber(value) : new BigNumber(0)
                        );
                      }}
                      thousandSeparator
                      allowNegative={false}
                      placeholder="0"
                    />
                    <div
                      className="redeem-details-input-text max-button"
                      onClick={() => {
                        setInputAmount(userVRTBalance);
                      }}
                    >
                      Max
                    </div>
                  </div>
                  <p className="redeem-details-input-desc">
                    Balance:
                    {account ? '-' : userVRTBalance.toFixed(2)}
                  </p>
                  <div className="redeem-details-input-error-text">
                    {inputValid ? ' ' : 'Insufficient VRT balance'}
                  </div>
                  {/* output area */}
                  <p className="redeem-details-input-title">
                    Your will receive
                  </p>
                  <div className="redeem-details-input-row flex align-center">
                    <img
                      className="redeem-details-input-icon"
                      src={xvsImg}
                      alt="xvs"
                    />
                    <p className="redeem-details-input-input">
                      {commaFormater(
                        inputAmount.multipliedBy(redeemRatio).toString(10)
                      )}
                    </p>
                    <div className="redeem-details-input-text right">XVS</div>
                  </div>
                </div>
                {/* connect & redeem button */}
                {
                  <div
                    className="redeem-button center"
                    onClick={() => {
                      if (account) {
                        setIsConfirmModalVisible(true);
                      } else {
                        setShowConnectModal(true);
                      }
                    }}
                  >
                    {account ? 'Redeem' : 'Connect'}
                  </div>
                }
              </div>
            </Col>
          </Row>
        </VRTWrapper>
        <RedeemConfirmModal
          visible={isConfirmModalVisible}
          priceStr={redeemRatio.toFixed(8)}
          sendAmtStr={commaFormater(inputAmount.toString(10))}
          recieveAmtStr={commaFormater(
            inputAmount.multipliedBy(redeemRatio).toString(10)
          )}
          onCancel={() => setIsConfirmModalVisible(false)}
          onOk={() => confirmRedeem()}
        />
        <RedeemSuccessModal
          visible={isSuccessModalVisible}
          sendAmtStr={commaFormater(inputAmount.toString(10))}
          recieveAmtStr={commaFormater(
            inputAmount.multipliedBy(redeemRatio).toString(10)
          )}
          onCancel={() => setIsSuccessModalVisible(false)}
          txHash={txHash}
        />
      </MainLayout>
      <ConnectModal visible={showConnectModal} onClose={onClose} />
    </VRTLayout>
  );
}

VRT.propTypes = {
  settings: PropTypes.object
};

VRT.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getVoterAccounts, setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getVoterAccounts
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(VRT);
