// counter.store.js
import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class DistStore {
  
  distDb = {};
  // value obj is a json object
  // { value: number }

  constructor() {
    makeObservable(this, {
      distDb: observable,
      setDist: action.bound,
      getDist: action.bound
    })
  }

  setDist(dateKey, value) {
    this.distDb[dateKey] = value;
  }

  getDist(dateKey) {
    return this.distDb[dateKey];
  }

}

// Instantiate the counter store.
const distStore = new DistStore();
// Create a React Context with the counter store instance.
export const DistStoreContext = React.createContext(distStore);
export const useDistStore = () => React.useContext(DistStoreContext)