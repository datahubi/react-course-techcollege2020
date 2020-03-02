import { useState } from "react";

export let debug = false

const log = (...args) => debug && console.log("CACHE:", ...args)

const memCache = {};

const memStorageGetitem = (
  key,
  storage = window.localStorage,
  cacheName = "localStorage"
) => {
  const cache = memCache[cacheName] && memCache[cacheName][key];
  let returnItem;
  if (!cache) {
    log("No mem cache for", key);
    try {
      // Get from local storage by key
      const rawStorageItem = storage.getItem(key);
      if (rawStorageItem) {
        returnItem = rawStorageItem;
        // Parse stored json or if none return initialValue
        const jsonStor = JSON.parse(rawStorageItem);
  
        if (jsonStor) {
          if (!memCache[cacheName]) {
            memCache[cacheName] = {};
          }
          memCache[cacheName][key] = rawStorageItem;
          log(
            "Wrote object to cache & read from storage",
            cacheName + "." + key
            // memCache[cacheName][key]
          );
          // console.log("TCL: memStorageGetitem -> jsonStor", memCache[cacheName][key])
          return jsonStor;
        }
      }
    } catch (error) {
      if (returnItem) {
        if (!memCache[cacheName]) {
          memCache[cacheName] = {};
        }
        memCache[cacheName][key] = returnItem;
        log(
          "Wrote string to cache",
          cacheName + "." + key
          // memCache[cacheName][key]
        );
        return returnItem;
      }
      throw error;
    }
  }
  log("Read cache from", cacheName, key);
  return cache;
};

const memStorageSetItem = (
  key,
  item,
  storage = window.localStorage,
  cacheName = "localStorage"
) => {
  if (!memCache[cacheName]) {
    memCache[cacheName] = {};
  }

  if(memCache[cacheName][key]) {
    if(Object.is(memCache[cacheName][key], item)) {
      log("Cache item is the same as new item. No need to write");
      return memCache[cacheName][key]
    }
  }
  try {
    let value = typeof item === "string" ? item : JSON.stringify(item);
    storage.setItem(key, value);
    memCache[cacheName][key] = item;
    log(
      "Wrote cache & storage",
      cacheName,
      key
      // memCache[cacheName][key]
    );
    return item
  } catch (error) {
    return item;
  }
}; 

const clearStorageItem = (
  key,
  storage = window.localStorage,
  cacheName = "localStorage"
) => {
  storage.removeItem(key);
  if (memCache[cacheName] && memCache[cacheName][key]) {
    log(
      "deleting ",
      cacheName + "." + key
      // memCache[cacheName][key]
    );
    delete memCache[cacheName][key];
  }
};

export function useStorageMem(
  key,
  initialValue,
  storageInput = window.localStorage,
  cacheName = "localStorage"
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once

  const storage = storageInput;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      // const item = window.localStorage.getItem(key);
      const item = memStorageGetitem(key, storage, cacheName);
      // console.log("TCL: useSessionStorageMem -> item", item)
      // Parse stored json or if none return initialValue
      return item || initialValue;
    } catch (error) {
      // If error also return initialValue
      log(error);
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
      const returnItem = memStorageSetItem(
        Key,
        valueToStore,
        storage,
        cacheName
      );

      // Save to local storage
      setStoredValue(valueToStore);
      return returnItem;
    } catch (error) {
      // A more advanced implementation would handle the error case
      log(error);
    }
  };

  const clearAll = (setInit = true) => {
    clearStorageItem(key, storage, cacheName);
    if (setInit) {
      setStoredValue(initialValue);
    }
  };

  return [storedValue, setValue, clearAll, memCache];
}

export const useLocalStorageMem = (key, initialValue) =>
  useStorageMem(key, initialValue);
  
export const useSessionStorageMem = (key, initialValue) =>
  useStorageMem(key, initialValue, window.sessionStorage, "sessionStorage");

export default useStorageMem;
