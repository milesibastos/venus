import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';
import vrtImg from 'assets/img/coins/vrt.png';
import xvsImg from 'assets/img/coins/xvs.png';

import './index.scss';

const ModalContent = styled.div`
  border-radius: 16px;
`;

function RedeemConfirmModal({
  visible,
  priceStr,
  sendAmtStr,
  recieveAmtStr,
  onCancel,
  onOk
}) {
  return (
    <Modal
      className="redeem-confirm-modal"
      width={360}
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
        <p className="title">Confirm the transaction</p>
        <div className="info-section">
          <div className="info-section-item">
            <span className="info-item-title">Price:</span>
            <span>1VRT = {priceStr} XVS</span>
          </div>
          <div className="info-section-item">
            <span className="info-item-title">Send:</span>
            <div>
              <img src={xvsImg} alt="xvs" />
              <span>{sendAmtStr} XVS</span>
            </div>
          </div>
          <div className="info-section-item">
            <span className="info-item-title">Recieve:</span>
            <div>
              <img src={vrtImg} alt="vrt" />
              <span>{recieveAmtStr} VRT</span>
            </div>
          </div>
        </div>
        <div className="redeem-modal-footer">
          <div
            className="redeem-modal-button redeem-modal-button-cancel"
            onClick={() => onCancel()}
          >
            Cancel
          </div>
          <div
            className="redeem-modal-button redeem-modal-button-confirm"
            onClick={() => onOk()}
          >
            Confirm
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

RedeemConfirmModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  priceStr: PropTypes.string.isRequired,
  sendAmtStr: PropTypes.string.isRequired,
  recieveAmtStr: PropTypes.string.isRequired
};

RedeemConfirmModal.defaultProps = {
  visible: false,
  onCancel: () => {},
  onOk: () => {}
};

export default RedeemConfirmModal;
