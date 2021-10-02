import React, { useState, useEffect } from 'react';
import CustomMultiPicker from "react-native-multiple-select-list";
import { View, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getEncodedJSON } from '../utils/helper';
import { createPreferences, updatePreferences } from '../graphql/mutations'


const Preferences = ({ navigation }) => {
    const userList = [
        "Sports",
        "Indian Grocery",
        "Italian Restaurants",
        "Chinese Restaurants",
        "Gym and Fitness",
        "Music and Concerts",
        "Fast Foods",
        "All Grocery"]

    const [preferences, setPreferences] = useState([]);
    const [userData, setUserData] = useState({});
    // Remove undefineds from preferences[] when sending
    
    useEffect(() => {
        async function fetchUserData() {
          // You can await here
          const data = await Auth.currentAuthenticatedUser();
          setUserData(data.attributes);
        }
        fetchUserData();
      }, []);
    
    return (
        <View>
            <ScrollView>
                <CustomMultiPicker
                    options={userList}
                    search={true} // should show search bar?
                    multiple={true} //
                    placeholder={"Search"}
                    placeholderTextColor={'#757575'}
                    returnValue={"label"} // label or value
                    callback={(res) => {
                        // console.log(res);
                        setPreferences(res);
                    }} // callback, array of selected items
                    rowBackgroundColor={"#eee"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={30}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    scrollViewHeight={400}
                />
            </ScrollView>
            <View style={styles.container}>
                <TouchableHighlight
                    onPress={ async () => {
                        // Mutation appears to be lacking Upsert operation
                        // Hack time
                        try {
                        const response = await API.graphql(
                                graphqlOperation(createPreferences, {
                                    input : {
                                        id: userData.sub,
                                        email: userData.email,
                                        preferences: getEncodedJSON([...preferences.filter(x => x != undefined)])
                                      }
                                })
                            )
                        }
                        // Use 'response' variable to show toast if response code is 200 @TODO

                        catch(err) {
                            if(err.errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
                                try { 
                                    const response = await API.graphql(
                                        graphqlOperation(updatePreferences, {
                                            input : {
                                                id: userData.sub,
                                                email: userData.email,
                                                preferences: getEncodedJSON([...preferences.filter(x => x != undefined)])
                                              }
                                        })
                                    )
                                    // Use 'response' variable to show toast if response code is 200 @TODO
                                }
                                catch(err) {
                                    console.log('Failed operation. ')
                                }
                            }
                        }
                        // Send to AWS 
                    }}
                    underlayColor="white">
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        alignItems: 'center'
    },
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    }
});
export default Preferences;