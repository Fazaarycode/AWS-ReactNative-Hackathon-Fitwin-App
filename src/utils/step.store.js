// counter.store.js
import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class StepStore {
  
  stepsDb = {};
  // value obj is a json object
  // { value: number }

  constructor() {
    makeObservable(this, {
      stepsDb: observable,
      setSteps: action.bound,
      getSteps: action.bound
    })
  }

  setSteps(dateKey, value) {
    this.stepsDb[dateKey] = value;
  }

  getSteps(dateKey) {
    return this.stepsDb[dateKey];
  }

  // increment() {
  //   this.count += 1;
  // }

  // decrement() {
  //   this.count -= 1;
  // }
}

// Instantiate the counter store.
const stepStore = new StepStore();
// Create a React Context with the counter store instance.
export const StepStoreContext = React.createContext(stepStore);
export const useStepStore = () => React.useContext(StepStoreContext)