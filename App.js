import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/home-screen';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';
import MyProfile from './src/screens/my-profile-screen';
import PreferenceScreen from './src/screens/preferences-screen';
import TestScreen from './src/screens/test-screen';

import { ToastProvider, useToast } from 'react-native-toast-notifications';

import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { useCounterStore, CounterStoreContext } from './src/utils//counter.store';
import { useNotificationStore } from './src/utils//notification.store';

const App = () => {
  const Stack = createStackNavigator();
  const { pushNotification } = useNotificationStore(); // OR useContext(CounterStoreContext)
  const { devToken, saveToken } = useCounterStore(); // OR useContext(CounterStoreContext)

  // ############################################################
  // ##### Notification Related
  // ############################################################
  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    console.log(`FITWIN remote > notification = ${JSON.stringify(notification,null,2)}`);

    const notificationPayload = JSON.parse(notification._alert.body);

    const strMsg = `${notification._alert.title} - ${notificationPayload.name}`;
    console.log(`FITIN remote > notification strMsg = [${strMsg}], couponId=[${notificationPayload.couponId}]`);
    pushNotification(notification._alert); // fire a state change
    // toast.show(strMsg, {
    //   type: "custom1",
    //   placement: "top",
    //   duration: 4000,
    //   offset: 30,
    //   animationType: "slide-in | zoom-in",
    //   data: {
    //     title: strMsg,
    //     couponId: notificationPayload.couponId,
    //   }
    // });

    if (isClicked) {
      // Navigate user to another screen
      console.log(`FITWIN > User clicked notification!!!`);
    } else {
      // Do something else with push notification
      console.log(`FITWIN > User dismissed notification. ~~~`);
    }
  };
  const onRegister = (token) => {
    console.log('FITWIN > in app registration', token);
    saveToken(token);
  }
  const onLocalNotification = (notification) => {
    console.log('FITWIN > local notification', notification);
  }
  // ############################################################
  // ##### Notification Related
  // ############################################################

  useEffect(() => {
    console.log(`FITWIN > useEffect 123`);
    async function fetchUserData() {
      // You can await here
      const user = await Auth.currentAuthenticatedUser();
    }
    fetchUserData();
    console.log(`FITWIN > APNS requestPermissions 1`);
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.checkPermissions(function () {
      PushNotificationIOS.addEventListener('notification', onRemoteNotification);
      PushNotificationIOS.addEventListener('register', onRegister);
      PushNotificationIOS.addEventListener('localNotification', onLocalNotification);
    });
    console.log(`FITWIN > APNS requestPermissions 2`);

}, []); // Or [] if effect doesn't need props or state


  return (
    <ToastProvider
      renderType={{
        custom1: (toastItem) => (
          <View style={{padding: 15, backgroundColor: 'lightgreen'}}>
            <Text>{toastItem.title}</Text>
            <Text>{toastItem.couponId}</Text>
          </View>
        )
    }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Home',
              headerStyle: {
                // backgroundColor: '#ff9300',
                backgroundColor: '#7165E3',
              },
              headerRight: () => (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate('MyProfile')}>
                  <Icon name={'plus'} size={20} color="#000000" />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <View style={styles.logOutBtn}>
                  <Button
                    icon={<Icon name="sign-out" size={25} color="#000000" />}
                    onPress={() => Auth.signOut()}
                    type="clear"
                  />
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="MyProfile"
            buttonStyle={styles.addButton}
            component={MyProfile}
            options={{
              title: 'My Profile',
              headerStyle: {
                backgroundColor: '#7165E3',
              },
            }}
          />
          <Stack.Screen
            name="PreferenceScreen"
            buttonStyle={styles.addButton}
            component={PreferenceScreen}
            options={{
              title: 'Add Preferences',
              headerStyle: {
                backgroundColor: '#7165E3',
              },
            }}
          />
          <Stack.Screen
            name="TestScreen"
            buttonStyle={styles.addButton}
            component={TestScreen}
            options={{
              title: 'Test Screen',
              headerStyle: {
                backgroundColor: '#ff9300',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};
const styles = StyleSheet.create({
  addButton: {
    marginRight: 20,
  },
  logOutBtn: {
    marginLeft: 10,
  },
});
// export default App;
export default withAuthenticator(App);