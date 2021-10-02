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

import { ToastProvider } from 'react-native-toast-notifications'


const App = () => {
  const Stack = createStackNavigator();

useEffect(() => {
  async function fetchUserData() {
    // You can await here
    const user = await Auth.currentAuthenticatedUser();
  }
  fetchUserData();
}, []); // Or [] if effect doesn't need props or state


  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Home',
              headerStyle: {
                backgroundColor: '#ff9300',
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
                backgroundColor: '#ff9300',
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