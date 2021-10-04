// notification.store.js
import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class NotificationStore {
  
  notificationDb = [];
  notificationCount = 0;

  constructor() {
    makeObservable(this, {
      notificationDb: observable,
      notificationCount: observable,
      pushNotification: action.bound,
      tryPop: action.bound,
      popNotification: action.bound,
    })
  }

  pushNotification(notification) {
    this.notificationDb.unshift(notification);
    this.notificationCount = this.notificationDb.length;
  }

  tryPop() {
    if (this.notificationDb.length > 0) 
      return this.notificationDb[0];
    return null;
  }

  popNotification() {
    this.notificationDb.shift();
    this.notificationCount = this.notificationDb.length;
  }

}

// Instantiate the counter store.
const notificationStore = new NotificationStore();
// Create a React Context with the counter store instance.
export const NotificationStoreContext = React.createContext(notificationStore);
export const useNotificationStore = () => React.useContext(NotificationStoreContext)