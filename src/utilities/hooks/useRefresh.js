import { useContext } from 'react';
import { RefreshContext } from 'utilities/providers/RefreshProvider';

export const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext);
  return { fastRefresh: fast, slowRefresh: slow };
};
