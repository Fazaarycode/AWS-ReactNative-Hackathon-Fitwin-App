import React, {useEffect, useState} from 'react';
import {API} from 'aws-amplify';
import {SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity, View, Button} from 'react-native';
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

import { observer } from 'mobx-react-lite';

import { useCounterStore, CounterStoreContext } from '../utils//counter.store';
import { useStepStore, StepStoreContext } from '../utils/step.store';

const debugFrame = false;


// import {listProducts} from '../../graphql/queries';
// import ProductList from '../components/ProductList';

const HomeScreen = observer((props) => {
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

  // ============
  const { count, increment, decrement } = useCounterStore(); // OR useContext(CounterStoreContext)
  const { stepsDb, setSteps, getSteps } = useStepStore(); // OR useContext(CounterStoreContext)

  useEffect(() => {
    console.log(`FITWIN > HomeScreen > START`);

    tryInitAppleHealthKit();
    // refreshHealthData();

    console.log(`FITWIN > HomeScreen > END`);

  }, []);
  
  const [stepsData, setStepsData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [distData, setDistData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});

  const [displaySteps, setDisplaySteps] = useState(0);
  const [displayStepPercent, setDisplayStepPercent] = useState(0);
  // const [displayDist, setDisplayDist] = useState(0); // m

  // TODO >>>>
  // Need to retreive target data HERE
  const stepsTarget:FWHealthTarget = {valid: true, targetValue: 10000};
  const distTarget:FWHealthTarget = {valid: true, targetValue: 10000};

  const tryInitAppleHealthKit = async () => {

    await AppleHealthKitWrapper.init();
    await AppleHealthKitWrapper.getAuthStatus();

    // const todayDate = new Date();
    // let yesterdayDate = new Date();
    // yesterdayDate.setDate(todayDate.getDate() - 1);

    const todayObj = new Date();

    const todayStr = todayObj.toISOString().split('T')[0];
    console.log(`todayStr = ${todayStr}`);
    
    const yesterdayObj = new Date(todayObj.valueOf() - (24 * 60 * 60 * 1000));
    const yesterdayStr = yesterdayObj.toISOString().split('T')[0];
    console.log(`yesterdayStr = ${yesterdayStr}`);

    for (let i = 0; i < 10; i += 1) {
      // going from today, query health kit for data and then set to store
      const iDateObj = new Date(todayObj.valueOf() - (i * 24 * 60 * 60 * 1000));
      const iDateStr = iDateObj.toISOString().split('T')[0];
      console.log(`${i} dateLabelStr = ${iDateStr}`);

      const iStep = await AppleHealthKitWrapper.getStepCount(iDateObj);
      console.log(`${i} HealthKit: stepCount=${JSON.stringify(iStep,null,2)}`);      
      let iStepHealthData = iStep as FWHealthData;


      setSteps(iDateStr, iStepHealthData.value);
    }


    // set to display
    // const lastWeekSteps = getWeekTotalSteps();
    // setDisplaySteps(lastWeekSteps);
    // setDisplayStepPercent(lastWeekSteps * 100 / stepsTarget.targetValue);

    
    const todayDate = new Date('2021-10-03');
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

  const getWeekTotalSteps = () => {
    const todayObj = new Date();

    const todayStr = todayObj.toISOString().split('T')[0];
    console.log(`todayStr = ${todayStr}`);
    let _count = 0;

    for (let i = 0; i < 7; i += 1) {
      // going from today, query health kit for data and then set to store
      const iDateObj = new Date(todayObj.valueOf() - (i * 24 * 60 * 60 * 1000));
      const iDateStr = iDateObj.toISOString().split('T')[0];
      console.log(`${i} dateLabelStr = ${iDateStr}`);

      // see if it is in the store
      if (iDateStr in stepsDb) {
        // tally the value
        _count += stepsDb[iDateStr];
      }

      
    }
    return _count;
  }


  const showStepsDB = () => {
    const keys = Object.keys(stepsDb);
    console.log(`showStepsDb = ${JSON.stringify(keys,null,2)}`);
    for (let k = 0; k < keys.length; k += 1) {
      // print stepsDb
      console.log(`db[${keys[k]}] val=${stepsDb[keys[k]]}`);
    }
  }

  // const refreshHealthData = async (numDays: number) => {
  //   const todayDate = new Date();
  //   let yesterdayDate = new Date();
  //   yesterdayDate.setDate(todayDate.getDate() - 1);

  //   const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
  //   console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
  //   // let step1data = {...step1};
  //   let step1data = step1 as FWHealthData;
  //   step1data.valid = true;
  //   setStepsData(step1data);

  //   const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
  //   console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
  //   let dist1data = res2 as FWHealthData;
  //   dist1data.valid = true;
  //   setDistData(dist1data);
  // }

  const stepsInAWeek = getWeekTotalSteps();
  console.log(`John > 1 week of steps = ${stepsInAWeek}`);


  // calculate step related features
  // const numSteps = stepsData?.value||0;
  
  const stepsPercent = Math.floor(stepsInAWeek * 100 / stepsTarget.targetValue);
  
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
        
        { stepsData.valid &&
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
              <Text style={styles.stepText}>{stepsInAWeek} steps</Text>
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
        {debugFrame && 
        <>
          <Text>{`Clicked ${count} times!`}</Text>
          <Button title="Increment" onPress={increment} />
          <Button title="Decrement" onPress={decrement} />
          <Button title="debugStepsStore" onPress={showStepsDB} />
        </>
        }
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Verdana-BoldItalic"
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    textAlign: "center",
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