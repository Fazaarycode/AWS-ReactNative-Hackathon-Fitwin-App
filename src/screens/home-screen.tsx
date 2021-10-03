import React, {useEffect, useState} from 'react';
import {API} from 'aws-amplify';
import {SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import { FWHealthData, FWHealthTarget } from '../utils/HealthDataTypes';
import AppleHealthKitWrapper from '../utils/AppleHealthKitWrapper';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

// import {listProducts} from '../../graphql/queries';
// import ProductList from '../components/ProductList';

const HomeScreen = (props) => {
  // const [productsList, setProducts] = useState([]);
  // const [refreshing, setRefreshing] = useState(false);
  // const fetchProducts = async () => {
  //   try {
  //     const products = await API.graphql({query: listProducts});
  //     if (products.data.listProducts) {
  //       console.log('Products: \n');
  //       console.log(products);
  //       setProducts(products.data.listProducts.items);
  //     }
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };
  // useEffect(() => {
  //   fetchProducts();
  // }, []);
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await fetchProducts();
  //   setRefreshing(false);
  // };

  useEffect(() => {
    console.log(`FITWIN > HomeScreen > START`);

    tryInitAppleHealthKit();
    // refreshHealthData();

    console.log(`FITWIN > HomeScreen > END`);

  }, []);

  const [stepsData, setStepsData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [distData, setDistData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});

  const tryInitAppleHealthKit = async () => {

    await AppleHealthKitWrapper.init();
    await AppleHealthKitWrapper.getAuthStatus();

    const todayDate = new Date();
    let yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
    console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
    // let step1data = {...step1};
    let step1data = step1 as FWHealthData;
    step1data.valid = true;
    setStepsData(step1data);

    const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
    console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
    let dist1data = res2 as FWHealthData;
    dist1data.valid = true;
    setDistData(dist1data);
    
  }

  const refreshHealthData = async (numDays: number) => {
    const todayDate = new Date();
    let yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
    console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
    // let step1data = {...step1};
    let step1data = step1 as FWHealthData;
    step1data.valid = true;
    setStepsData(step1data);

    const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
    console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
    let dist1data = res2 as FWHealthData;
    dist1data.valid = true;
    setDistData(dist1data);
  }

  // TODO >>>>
  // Need to retreive target data HERE
  const stepsTarget:FWHealthTarget = {valid: true, targetValue: 10000};
  const distTarget:FWHealthTarget = {valid: true, targetValue: 10000};


  // calculate step related features
  const numSteps = stepsData?.value||0;
  const stepsPercent = Math.floor(numSteps * 100 / stepsTarget.targetValue);
  
  // setup charts
  const chartData = {
    labels: ["Step"], // optional
    data: [stepsPercent]
  };

  const barChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [10, 20, 45, 28, 80, 99, 43]
      }
    ]
  };
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {/* <Text>Hello World John 2277!</Text> */}
        
        {stepsData.valid && 
          <View style={{flexDirection: 'column', justifyContent: 'center'}}>            
            <Text style={styles.stepTitle}>Steps Goal Attained</Text>
            <ProgressChart
              data={chartData}
              width={400}
              height={220}
              strokeWidth={16}
              radius={64}
              chartConfig={chartConfig}
              hideLegend={true}
            />
            <View style={styles.stepTextBlock}>
              <Text style={styles.stepText}>{numSteps} steps</Text>
              <Text style={styles.stepText2}>{stepsPercent}%</Text>
            </View>
            {/* <BarChart
              // style={graphStyle}
              data={barChartData}
              width={400}
              height={220}
              yAxisLabel={""}
              yAxisSuffix={""}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
            /> */}
          </View>
        }
        {distData.valid &&
          <Text style={styles.distText}>{distData.value} km</Text>
        }
        {/* {productsList && (
          <ProductList
            productList={productsList}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )} */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Verdana-BoldItalic"
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    textAlign: "center"
    // position: 'absolute', 
    // right: 0,
    // left: 20,
    // top: 0,
  },
  stepTextBlock: {
    position: 'absolute', 
    right: 0,
    top: 100,
  },
  stepText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    // position: 'absolute', 
    // right: 0,
    // top: 50,
  },
  stepText2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    textAlign: "right",
    // position: 'absolute', 
    // right: 0,
    // top: 50,
  },
  distText: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",    
    backgroundColor: "pink",
  }
});
//#a34075
const chartConfig = {
  backgroundGradientFrom: "#a34075",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#a34075",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(9,21,102, ${opacity})`,
  propsForLabels: {
    fontSize: 15
  },
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

export default HomeScreen;