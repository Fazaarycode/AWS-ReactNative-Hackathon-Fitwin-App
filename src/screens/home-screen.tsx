import React, {useEffect, useState} from 'react';
import {API} from 'aws-amplify';
import {SafeAreaView, StatusBar, Text, TouchableOpacity} from 'react-native';
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

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

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

    console.log(`FITWIN > HomeScreen > END`);

  }, []);

  const [stepsData, setStepsData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [distData, setDistData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});

  const tryInitAppleHealthKit = async () => {

    await AppleHealthKitWrapper.init();
    await AppleHealthKitWrapper.getAuthStatus();
    // const height1 = await AppleHealthKitWrapper.getLatestHeight();
    // console.log(`HealthKit: height=${JSON.stringify(height1,null,2)}`);
    
    // const weight1 = await AppleHealthKitWrapper.getLatestWeight();
    // console.log(`HealthKit: weight=${JSON.stringify(weight1,null,2)}`);

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
  const stepsPercent = (stepsData?.value||0) / stepsTarget.targetValue;

  // setup charts
  const chartData = {
    labels: ["Step"], // optional
    data: [stepsPercent]
  };

  
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Hello World John 2277!</Text>
        {stepsData.valid && 
          <ProgressChart
            data={chartData}
            width={400}
            height={220}
            strokeWidth={16}
            radius={64}
            chartConfig={chartConfig}
            hideLegend={false}
          />}
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
export default HomeScreen;