import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Web3ReactProvider } from '@web3-react/core';
import en from 'react-intl/locale-data/en';
import enMessages from 'lang/en';
import { RefreshContextProvider } from 'utilities/providers/RefreshProvider';
import { store } from 'core';
import ethers from 'ethers';
import ThemeProvider from './Theme';

const messages = {
  en: enMessages
};

addLocaleData([...en]);
const initialLang = 'en';

const POLLING_INTERVAL = 12000;

export const getLibrary = provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

// eslint-disable-next-line react/prop-types
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <IntlProvider locale={initialLang} messages={messages[initialLang]}>
          <ReduxProvider store={store}>
            <RefreshContextProvider>{children}</RefreshContextProvider>
          </ReduxProvider>
        </IntlProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}
