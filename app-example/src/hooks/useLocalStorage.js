import { useState } from 'react';

const memCache = {};

const memLocalStorageGetitem = key => {
// console.log("TCL: key", key)
  const cache = memCache[key];
  if(!cache) {
    try {
      // Get from local storage by key
      const rawStorageItem = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      const storageItem  = JSON.parse(rawStorageItem);


      if(storageItem) {
        memCache[key] = storageItem;
        return storageItem
      }
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      throw error;
      // return initialValue;
    }
    return;
    // return returnItem
  }
  return cache;
}

const memLocalStorageSetItem = (key, item) => {
  // const cachedItem = memLocalStorageGetitem(key);
  try {
    const value = JSON.stringify(item);
    window.localStorage.setItem(key, value);
    memCache[key] = item;
    return item
  } catch (error) {
    // A more advanced implementation would handle the error case
    console.log(error);
    throw error;
  }
}

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Save state
        setStoredValue(valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Hook
export function useLocalStorageMem(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      // const item = window.localStorage.getItem(key);
      const item = memLocalStorageGetitem(key);
      // Parse stored json or if none return initialValue
      // if(!item) {
      //   return memLocalStorageSetItem(key, initialValue);
      // }
      return item || initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value, Key = key) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      const returnItem = memLocalStorageSetItem(Key, valueToStore)
      setStoredValue(valueToStore);
      return returnItem;
      // Save to local storage
      // window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
export default useLocalStorage;