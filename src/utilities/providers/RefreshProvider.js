import React, { useState, useEffect, createContext } from 'react';

const FAST_REFRESH_INTERVAL = 5000;
const SLOW_REFRESH_INTERVAL = 15000;

const RefreshContext = createContext({ slow: 0, fast: 0 });

// eslint-disable-next-line react/prop-types
const RefreshContextProvider = ({ children }) => {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast(prev => prev + 1);
    }, FAST_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow(prev => prev + 1);
    }, SLOW_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ slow, fast }}>
      {children}
    </RefreshContext.Provider>
  );
};

export { RefreshContext, RefreshContextProvider };
