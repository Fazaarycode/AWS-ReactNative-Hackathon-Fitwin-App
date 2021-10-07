import React, { useEffect, useState } from 'react';
import { SafeAreaView, Dimensions, StatusBar, TouchableOpacity, Image, View, Text, Button, StyleSheet } from 'react-native';
import { Auth, API, graphqlOperation, Analytics } from 'aws-amplify';
import { getCoupons, getPreferences } from '../graphql/queries';
import Icon from 'react-native-vector-icons/FontAwesome5';


import {
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";

const data = {
  labels: ["Swim"], // optional
  data: [0.8]
};

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
      const ppreferences = await API.graphql(graphqlOperation(getPreferences, { id: data.attributes.sub }));
      // console.log(ppreferences.data.getCoupons.imgData)
      // setImageUrl(res.data.getCoupons.imgData); 
      setPref(JSON.parse(ppreferences.data.getPreferences.preferences))
    }
    fetchUserData();
  }, [imageUrl]);

  useEffect(() => {

  });
  return (
    <>
      <View>
        {/* Circle Maaann Maaaannnn */}
        <Icon
          style={styles.iconSpacing}
          name={'walking'} size={30} color="#000000" />
        <Text style={
          styles.textHeader
        }>
          You walked <Text style={styles.highlight}>XXXXX</Text> steps today
        </Text>

        {/* X is a State var */}

        <Text style={
          styles.infoTip
        }>
          X % of daily goal
        </Text>

        {/* Show Distance Walked */}

        <Text style={
          styles.distanceWalkedKM
        }>
          {'X'}
        </Text>

        <Text style={
          styles.distanceWalkedSupportText
        }>
          {'Distance covered (kms)'}
        </Text>

        {/* Calories or any other measurement - Hardcode if not available */}

        <Text style={
          styles.calories
        }>
          {'X'}
        </Text>

        <Text style={
          styles.caloriesSupportText
        }>
          {'Cal Burned'}
        </Text>
    
        <View>
          <ProgressChart
            data={data}
            width={Dimensions.get("window").width} // Code your Screen Width
            height={300}
            strokeWidth={6}
            radius={60}
            chartConfig={
              {
                backgroundColor: "#F4F6FA",
                backgroundGradientFrom: "#D3D3D3",
                backgroundGradientTo: "#F4F6FA",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgb(104, 116, 224, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 139, ${opacity})`,
                style: {
                  borderRadius: 16,
                  zIndex: 1
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "1",
                  stroke: "#ffa726"
                }
              }
            }
            hideLegend={false}
          />

        </View>

        {/* Statistics Maaaannnn */}
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: 0,
            backgroundGradientFromOpacity:0,
            backgroundGradientTo: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(244, 175, 58, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            backgroundColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginTop: 0,
            backgroundColor: 'transparent'
          }}
        />
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  iconSpacing: {
    // marginRight: 5,
    position: 'absolute',
    left: "140px",
    top: "110px",
    zIndex: 99
  },
  textHeader: {
    position: 'absolute',
    top: "10px",
    left: "40px",
    zIndex: 9,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoTip: {
    position: 'absolute',
    top: "150px",
    left: "130px",
    zIndex: 9,
    textAlign: 'center',
    fontSize: 12,
    width: 50,
    fontWeight: 'bold',
  },
  highlight: {
    color: "#6874E0",
    fontWeight: 'bold'
  },
  distanceWalkedKM: { 
    color: "black",
    fontWeight: 'bold',
    fontSize: 16,
    position: 'absolute',
    top: "250px",
    left: "30px",
    zIndex: 9,
  },
  distanceWalkedSupportText: {
    color: "grey",
    fontSize: 12,
    position: 'absolute',
    top: "270px",
    left: "30px",
    zIndex: 9,
  },
  calories: { 
    color: "black",
    fontWeight: 'bold',
    fontSize: 16,
    position: 'absolute',
    top: "250px",
    right: "30px",
    zIndex: 9,
  },
  caloriesSupportText: {
    color: "grey",
    fontSize: 12,
    position: 'absolute',
    top: "270px",
    right: "30px",
    zIndex: 9,
  }
});

export default HomeScreen;