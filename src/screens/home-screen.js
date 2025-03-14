import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, TouchableOpacity , Image, View, Text} from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getCoupons } from '../graphql/queries';


const HomeScreen = (props) => {
  // const [userData, setUserData] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function fetchUserData() {
        // You can await here
        let data = await Auth.currentAuthenticatedUser();
        // setUserData(data.attributes);
        // Get current user's preferences if exists already.   
        const res = await API.graphql(graphqlOperation(getCoupons, {id: data.attributes.sub}));
        console.log(res.data.getCoupons.imgData)
        setImageUrl(res.data.getCoupons.imgData); 
    }
    fetchUserData();
}, [imageUrl]);
  return (
    <>
      <View>
      <Text> Hey there </Text>
      <Image
                style={{width: 297, height: 196, resizeMode:"contain"}}
                source={{uri: `${imageUrl}`}}
              />
      </View>
    </>
  );
};
export default HomeScreen;