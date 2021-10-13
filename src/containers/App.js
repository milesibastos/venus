import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Dashboard from 'containers/Main/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import XVS from 'containers/Main/XVS';
import Market from 'containers/Main/Market';
import Vault from 'containers/Main/Vault';
import MarketDetail from 'containers/Main/MarketDetail';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import Transaction from 'containers/Main/Transaction';
import Providers from './Providers';

import 'assets/styles/App.scss';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ToastContainer
          autoClose={8000}
          transition={Slide}
          hideProgressBar
          newestOnTop
          position={toast.POSITION.TOP_LEFT}
        />
        <Switch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0.5 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/vote" component={Vote} />
          <Route exact path="/xvs" component={XVS} />
          <Route exact path="/market" component={Market} />
          <Route exact path="/transaction" component={Transaction} />
          <Route exact path="/vault" component={Vault} />
          <Route exact path="/market/:asset" component={MarketDetail} />
          <Route exact path="/vote/leaderboard" component={VoterLeaderboard} />
          <Route exact path="/vote/proposal/:id" component={VoteOverview} />
          <Route
            exact
            path="/vote/address/:address"
            component={ProposerDetail}
          />
          {process.env.REACT_APP_ENV === 'dev' && (
            <Route exact path="/faucet" component={Faucet} />
          )}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </BrowserRouter>
    </Providers>
  );
}

export default hot(App);
