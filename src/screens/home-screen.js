import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, TouchableOpacity , Image, View, Text, Button} from 'react-native';
import { Auth, API, graphqlOperation, Analytics } from 'aws-amplify';
import { getCoupons, getPreferences } from '../graphql/queries';

const HomeScreen = (props) => {
  const [imageUrl, setImageUrl] = useState('');
  let [pref, setPref] = useState([]);
  useEffect(() => {
    async function fetchUserData() {
        // You can await here
        let data = await Auth.currentAuthenticatedUser();
        // setUserData(data.attributes);
        // Get current user's preferences if exists already.   
        // const res = await API.graphql(graphqlOperation(getCoupons, {id: data.attributes.sub}));
        const ppreferences = await API.graphql(graphqlOperation(getPreferences, {id: data.attributes.sub}));
        // console.log(ppreferences.data.getCoupons.imgData)
        // setImageUrl(res.data.getCoupons.imgData); 
        setPref(JSON.parse(ppreferences.data.getPreferences.preferences))
    }
    fetchUserData();
}, [imageUrl]);

  useEffect(() => {
    async function sendTargetCompletionEvent() {
      Analytics.updateEndpoint({
        address: 'b61e7b9465d63955320133feb0fba6aac4b567c68f5a49464e250f6c8064d4b0', // could be a device token, email address, or mobile phone number.
        attributes: {
            // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
            hobbies: [...pref],
        },
        channelType: 'APNS', // The channel type. Valid values: APNS, GCM
        /** Indicates whether a user has opted out of receiving messages with one of the following values:
            * ALL - User has opted out of all messages.
            * NONE - Users has not opted out and receives all messages.
            */
        optOut: 'NONE',
        // Customized userId
        // User attributes
        userId: "johnmclee",
        userAttributes: {
            interests: [...pref],
            // ...
        },
            // Buffer settings used for reporting analytics events.
            // OPTIONAL - The buffer size for events in number of items.
            bufferSize: 1000,

            // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
            flushInterval: 5000, // 5s 

            // OPTIONAL - The number of events to be deleted from the buffer when flushed.
            flushSize: 100,

            // OPTIONAL - The limit for failed recording retries.
            resendLimit: 5
  
    }).then(() => {
      console.log('Event sent!^^')
    }).catch(e => console.log(e));

    await Analytics.record({ name: "faz_testing", attributes: { id: 'bicboi' } })
    }

    sendTargetCompletionEvent();
  });
  return (
    <>
      <View>
      </View>
    </>
  );
};
export default HomeScreen;