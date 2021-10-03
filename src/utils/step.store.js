// counter.store.js
import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class StepStore {
  // count = 0;
  // date label as key '2021-10-03', value in number

  stepsDb = {};

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