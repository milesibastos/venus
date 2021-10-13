import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Select, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import {
  getTokenContract,
  getVbepContract,
  getComptrollerContract,
  getVaiTokenContract,
  methods
} from 'utilities/ContractService';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import ConnectModal from 'components/Basic/ConnectModal';
import { Label } from 'components/Basic/Label';
import Button from '@material-ui/core/Button';
import { connectAccount, accountActionCreators } from 'core';
import logoImg from 'assets/img/logo.png';
import commaNumber from 'comma-number';
import { getBigNumber } from 'utilities/common';
import XVSIcon from 'assets/img/venus.svg';
import XVSActiveIcon from 'assets/img/venus_active.svg';
import {
  LogoWrapper,
  SidebarWrapper,
  MainMenuWrapper,
  TotalValueWrapper,
  FaucetMenuWrapper,
  ConnectButtonWrapper,
  MobileMenuWrapper
} from 'containers/Layout/SidebarStyled';
import { useRefresh } from 'utilities/hooks/useRefresh';
import { useWeb3React } from '@web3-react/core';

const { Option } = Select;

const format = commaNumber.bindWith(',', '.');

// settings.latestBlockNumber
function Sidebar({ history, settings, setSetting, getGovernanceVenus }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [totalVaiMinted, setTotalVaiMinted] = useState('0');
  const [tvl, setTVL] = useState(new BigNumber(0));

  const defaultPath = history.location.pathname.split('/')[1];

  // eslint-disable-next-line no-unused-vars
  const { fastRefresh: fast, slowRefresh: slow } = useRefresh();

  const setDecimals = async () => {
    const decimals = {};
    Object.values(constants.CONTRACT_TOKEN_ADDRESS).forEach(async item => {
      decimals[`${item.id}`] = {};
      if (item.id !== 'bnb') {
        const tokenContract = getTokenContract(item.id);
        const tokenDecimals = await methods.call(
          tokenContract.methods.decimals,
          []
        );
        const vBepContract = getVbepContract(item.id);
        const vtokenDecimals = await methods.call(
          vBepContract.methods.decimals,
          []
        );
        decimals[`${item.id}`].token = Number(tokenDecimals);
        decimals[`${item.id}`].vtoken = Number(vtokenDecimals);
        decimals[`${item.id}`].price = 18 + 18 - Number(tokenDecimals);
      } else {
        decimals[`${item.id}`].token = 18;
        decimals[`${item.id}`].vtoken = 8;
        decimals[`${item.id}`].price = 18;
      }
    });
    setSetting({ decimals });
  };

  useEffect(() => {
    async function initSettings() {
      await setDecimals();
      // todo: do we need this pendingInfo set to null
      setSetting({
        pendingInfo: {
          type: '',
          status: false,
          amount: 0,
          symbol: ''
        }
      });
    }
    initSettings();
  }, []);

  // refresh latestBlockNumber
  const { chainId, library } = useWeb3React();
  useEffect(() => {
    if (library) {
      library.getBlockNumber().then(blockNumber => {
        setSetting({
          latestBlockNumber: blockNumber
        });
      });
    }
  }, [chainId, library]);

  const updateStakingInfoByMarketData = async () => {
    const appContract = getComptrollerContract();
    const vaiContract = getVaiTokenContract();

    let [vaultVaiStaked, venusVAIVaultRate] = await Promise.all([
      methods.call(vaiContract.methods.balanceOf, [
        constants.CONTRACT_VAI_VAULT_ADDRESS
      ]),
      methods.call(appContract.methods.venusVAIVaultRate, [])
    ]);
    // Total Vai Staked
    vaultVaiStaked = new BigNumber(vaultVaiStaked).div(1e18);

    // venus vai vault rate
    venusVAIVaultRate = new BigNumber(venusVAIVaultRate)
      .div(1e18)
      .times(20 * 60 * 24);

    // VAI APY
    const xvsMarket = settings.markets.find(
      ele => ele.underlyingSymbol === 'XVS'
    );
    const vaiAPY = new BigNumber(venusVAIVaultRate)
      .times(xvsMarket ? xvsMarket.tokenPrice : 0)
      .times(365 * 100)
      .div(vaultVaiStaked)
      .dp(2, 1)
      .toString(10);

    const totalLiquidity = (settings.markets || []).reduce(
      (accumulator, market) => {
        return new BigNumber(accumulator).plus(
          new BigNumber(market.totalSupplyUsd)
        );
      },
      vaultVaiStaked
    );

    setSetting({
      vaiAPY,
      vaultVaiStaked
    });

    // total vai minted
    let tvm = await methods.call(vaiContract.methods.totalSupply, []);
    tvm = new BigNumber(tvm).div(new BigNumber(10).pow(18));
    setTotalVaiMinted(tvm);
    setTVL(totalLiquidity);
  };

  // periodically request backend data
  useEffect(() => {
    async function update() {
      console.log('======== update period');
      const res = await promisify(getGovernanceVenus, {});
      if (!res.status) {
        return;
      }
      const markets = Object.keys(constants.CONTRACT_VBEP_ADDRESS)
        .map(item =>
          res.data.markets.find(
            market =>
              market.underlyingSymbol.toLowerCase() === item.toLowerCase()
          )
        )
        .filter(item => !!item);

      await updateStakingInfoByMarketData();

      setSetting({
        markets,
        dailyVenus: res.data.dailyVenus
      });
    }
    update();
  }, [slow]);

  return (
    <SidebarWrapper>
      <LogoWrapper>
        <NavLink to="/" activeClassName="active">
          <img src={logoImg} alt="logo" className="logo-text" />
        </NavLink>
      </LogoWrapper>
      <MainMenuWrapper>
        <NavLink
          className="flex flex-start align-center"
          to="/dashboard"
          activeClassName="active"
        >
          <Icon type="home" theme="filled" />
          <Label primary>Dashboard</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/vote"
          activeClassName="active"
        >
          <Icon type="appstore" />
          <Label primary>Vote</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/xvs"
          activeClassName="active"
        >
          <img className="xvs-icon" src={XVSIcon} alt="xvs" />
          <img className="xvs-active-icon" src={XVSActiveIcon} alt="xvs" />
          <Label primary>XVS</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/market"
          activeClassName="active"
        >
          <Icon type="area-chart" />
          <Label primary>Market</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/vault"
          activeClassName="active"
        >
          <Icon type="golden" theme="filled" />
          <Label primary>Vault</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/transaction"
          activeClassName="active"
        >
          <svg
            className="transaction"
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H7.488L12 4.20571V16H0V0ZM1.92 14.1714H10.08V5.02857H6.72V1.82857H1.92V14.1714ZM3.84703 8.62036H8.16703V6.79179H3.84703V8.62036ZM3.84703 12.2775H8.16703V10.449H3.84703V12.2775Z"
              fill="white"
            />
          </svg>
          <div className="flex flex-column align-center">
            <Label primary>Transaction</Label>
            <Label primary>History</Label>
          </div>
        </NavLink>
      </MainMenuWrapper>
      <FaucetMenuWrapper>
        {process.env.REACT_APP_ENV === 'dev' && (
          <NavLink
            className="flex just-center"
            to="/faucet"
            activeClassName="active"
          >
            <Label primary>Faucet</Label>
          </NavLink>
        )}
      </FaucetMenuWrapper>
      {settings.selectedAddress && (
        <TotalValueWrapper>
          <div className="flex flex-column align-center just-center">
            <Label primary>
              ${format(new BigNumber(tvl).dp(2, 1).toString(10))}
            </Label>
            <Label className="center">Total Value Locked</Label>
          </div>
        </TotalValueWrapper>
      )}
      {settings.selectedAddress && (
        <TotalValueWrapper>
          <div className="flex flex-column align-center just-center">
            <Label primary>
              {format(
                getBigNumber(totalVaiMinted)
                  .dp(0, 1)
                  .toString(10)
              )}
            </Label>
            <Label className="center">Total VAI Minted</Label>
          </div>
        </TotalValueWrapper>
      )}
      <ConnectButtonWrapper>
        <Button
          className="connect-btn"
          onClick={() => {
            setIsOpenModal(true);
          }}
        >
          {!settings.selectedAddress
            ? 'Connect'
            : `${settings.selectedAddress.substr(
                0,
                6
              )}...${settings.selectedAddress.substr(
                settings.selectedAddress.length - 4,
                4
              )}`}
        </Button>
      </ConnectButtonWrapper>
      <MobileMenuWrapper id="main-menu">
        <Select
          defaultValue={defaultPath}
          style={{ width: 120, marginRight: 10 }}
          getPopupContainer={() => document.getElementById('main-menu')}
          dropdownMenuStyle={{
            backgroundColor: '#090d27'
          }}
          dropdownClassName="asset-select"
          onChange={value => history.push(`/${value}`)}
        >
          <Option className="flex align-center just-center" value="dashboard">
            <Label size={14} primary>
              Dashboard
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="vote">
            <Label size={14} primary>
              Vote
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="xvs">
            <Label size={14} primary>
              XVS
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="market">
            <Label size={14} primary>
              Market
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="vault">
            <Label size={14} primary>
              Vault
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="transaction">
            <Label size={14} primary>
              Transaction History
            </Label>
          </Option>
          {process.env.REACT_APP_ENV === 'dev' && (
            <Option className="flex align-center just-center" value="faucet">
              <Label size={14} primary>
                Faucet
              </Label>
            </Option>
          )}
        </Select>
      </MobileMenuWrapper>
      <ConnectModal
        visible={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onConnected={() => setIsOpenModal(false)}
      />
    </SidebarWrapper>
  );
}

Sidebar.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired,
  getGovernanceVenus: PropTypes.func.isRequired
};

Sidebar.defaultProps = {
  settings: {},
  history: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting, getGovernanceVenus } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getGovernanceVenus
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Sidebar);
