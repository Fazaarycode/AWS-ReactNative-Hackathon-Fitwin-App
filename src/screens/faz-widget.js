import React, { useEffect, useState } from 'react';
import { SafeAreaView, Dimensions, StatusBar, TouchableOpacity, Image, View, Text, Button, StyleSheet } from 'react-native';
import { Auth, API, graphqlOperation, Analytics } from 'aws-amplify';
import { getCoupons, getPreferences } from '../graphql/queries';
import Icon from 'react-native-vector-icons/FontAwesome5';


import {
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import { ConsoleLogger } from '@aws-amplify/core';

const data = {
  labels: ["Swim"], // optional
  data: [0.8]
};


const FazWidget = (props) => {
  
  console.log(`FazWidget > render() ${JSON.stringify(props.payload,null,2)}`);
  
  const obj = JSON.parse(props.payload);
  console.log(`FazWdiget > obj = ${JSON.stringify(obj,null,2)}`);
  const xAxisArray = props.xaxis;
  if (xAxisArray) {
    console.log(`xxx xAxisArray = ${JSON.stringify(xAxisArray,null,2)}`);
  }
  else {
    xAxisArray = [];
  }

  const yValArray = props.yval;
  if (yValArray) {
    console.log(`yyy yValArray = ${JSON.stringify(yValArray,null,2)}`);
  }
  else {
    yValArray = [];
  }
  
  let chartData1 = {
    labels: ["1","2","3","4","5","6","7"],
    datasets: [
      {
        data: [80, 170, 44, 205, 234, 7]
      }
    ]
  };

  if (xAxisArray && yValArray && xAxisArray.length > 0 && yValArray.length > 0) {
    chartData1.labels = xAxisArray;
    chartData1.datasets[0].data = yValArray;
  }


  // // .map(item => item.x);
  // console.log(`xxx array = ${JSON.stringify(xAxisArray,null,2)}`);

  // makeChartData(props);
  
  

  
  


  // try {
  //   xAxisArray = props.chartdata.steps.map(item => item.x);
  //   yAxisValArray = props.chartdata.steps.map(item => item.y);
  // }
  // catch (err) {
  //   console.log(err);
  // }
  
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
          data={chartData1}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: 0,
            backgroundGradientFromOpacity:0,
            backgroundGradientTo: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(244, 175, 58, ${opacity})`,
            labelColor: (opacity = 1) => `grey`,
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
    left: 140,
    top: 110,
    zIndex: 99
  },
  textHeader: {
    position: 'absolute',
    top: 10,
    left: 40,
    zIndex: 9,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoTip: {
    position: 'absolute',
    top: 150,
    left: 130,
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
    top: 250,
    left: 30,
    zIndex: 9,
  },
  distanceWalkedSupportText: {
    color: "grey",
    fontSize: 12,
    position: 'absolute',
    top: 270,
    left: 30,
    zIndex: 9,
  },
  calories: { 
    color: "black",
    fontWeight: 'bold',
    fontSize: 16,
    position: 'absolute',
    top: 250,
    right: 30,
    zIndex: 9,
  },
  caloriesSupportText: {
    color: "grey",
    fontSize: 12,
    position: 'absolute',
    top: 270,
    right: 30,
    zIndex: 9,
  }
});

export default FazWidget;