import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import greenCheckImg from 'assets/img/green-check.png';
import closeImg from 'assets/img/close.png';

import './index.scss';

function RedeemSuccessModal({
  visible,
  sendAmtStr,
  recieveAmtStr,
  onCancel,
  txHash
}) {
  return (
    <Modal
      className="redeem-success-modal"
      width={360}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <img
        className="close-btn pointer"
        src={closeImg}
        alt="close"
        onClick={onCancel}
      />
      <img className="success-img" src={greenCheckImg} alt="success" />
      <p className="title">Redeem Submitted Successfully</p>
      <p className="subtitle">
        Redeeming {recieveAmtStr} VRT for {sendAmtStr} XVS
      </p>
      <a
        className="tx-link"
        href={`${process.env.REACT_APP_BSC_EXPLORER}/tx/${txHash}`}
        target="_blank"
        rel="noreferrer"
      >
        View at bscscan.com
      </a>
    </Modal>
  );
}

RedeemSuccessModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  sendAmtStr: PropTypes.string.isRequired,
  recieveAmtStr: PropTypes.string.isRequired,
  txHash: PropTypes.string.isRequired
};

RedeemSuccessModal.defaultProps = {
  visible: false,
  onCancel: () => {}
};

export default RedeemSuccessModal;
