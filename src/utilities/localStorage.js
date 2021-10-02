// @todo: stop using string as storage data format, it should be formal json object
let storageData = {};
let dirty = false;

export const loadState = () => {
  if (!dirty) {
    return storageData;
  }
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }
    storageData = JSON.parse(serializedState);
    return storageData;
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
    dirty = true;
  } catch (err) {
    return err;
  }
  return true;
};
