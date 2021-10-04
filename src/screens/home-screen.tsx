import React, {useEffect, useState} from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity, View, Button, Image, Dimensions, ScrollView} from 'react-native';
import { FWCoupon, FWHealthData, FWHealthTarget, FWStepData } from '../utils/HealthDataTypes';
import AppleHealthKitWrapper from '../utils/AppleHealthKitWrapper';
import * as Location from 'expo-location';

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

import * as configData from '../config/config.json';

import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNotificationStore } from '../utils/notification.store';

import { listCoupons } from '../graphql/queries';
import { createMetrics } from '../graphql/mutations';
import { FWConstants } from '../config/constants';
import { getISODaysAgoString, distanceBetweenTwoPoints } from '../utils/helper';

const debugFrame = true;


const HomeScreen = observer((props) => {
  
  const [userData, setUserData] = useState<any>({});
  const { count, increment, decrement } = useCounterStore(); // OR useContext(CounterStoreContext)
  const { stepsDb, setSteps, getSteps } = useStepStore(); // OR useContext(CounterStoreContext)
  const { notificationDb, notificationCount, popNotification, tryPop } = useNotificationStore(); // OR useContext(CounterStoreContext)
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const loadInitialCoupons = ():FWCoupon[] => {
    const {coupons} = configData;
    // console.log(`John > configData=${JSON.stringify(coupons,null,2)}`);
    const couponsTyped = coupons.map((x:any) => x as FWCoupon);
    return couponsTyped;
  }

  const getInitialStepData = ():FWStepData => {
    return {
      id: 0,
      email: userData.email,
      date: "",
      startTime: "",
      endTime: "",
      dailySteps: 0,
      deltaSteps: 0,
      dailyDist: 0,
      deltaDist: 0,
      latitude: 0,
      longitude: 0,
    };
  }
  
  const [stepsData, setStepsData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [distData, setDistData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [coupons, setCoupons] = useState(loadInitialCoupons());
  const [prevStepData, setPrevStepData] = useState(getInitialStepData());
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    console.log(`FITWIN > HomeScreen > START`);

    fetchUserData();

    tryInitAppleHealthKit();
    // refreshHealthData();

    tryGetCoupons();

    tryObtainLocationPermission();
    setTimeLeft(10);

    console.log(`FITWIN > HomeScreen > END`);

  }, []);

  useEffect(() => {
    console.log(`FITWIN > NEW Notificaiton changes! START`);
    console.log(JSON.stringify(notificationDb,null,2));

    // try pop
    const thisNotif = tryPop();
    if (thisNotif) {
      console.log(`Show Toast!`);
      // popNotification();
    }
    
    console.log(`FITWIN > NEW Notificaiton changes! END`);
  }, [notificationCount]);

  const calculateTimeLeft = () => {
    return timeLeft + 10; // increment 10s to cause 
  }

  useEffect(() => {
    let timer:NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        const thisTimeLeft = calculateTimeLeft();
        getCurrentStepDistMetric();
        setTimeLeft(thisTimeLeft);
        console.log(`Timer executed ✅✅✅✅`);
      }, FWConstants.PERIOD_SEND_HEALTHDATE);
    }    
    else {
      console.log(`Timer Expired! 🛑🛑🛑🛑`);
    }
    
    // clear timeout if the component is unmounted
    return () => {
      if (timer)
        clearTimeout(timer);
    }
  }, [timeLeft]);
 
  // TODO >>>>
  // Need to retreive target data HERE
  const stepsTarget:FWHealthTarget = {valid: true, targetValue: 10000};
  const distTarget:FWHealthTarget = {valid: true, targetValue: 10000};

  
  // TODO >>>>

  const fetchUserData = async () => {
    // You can await here
    const data = await Auth.currentAuthenticatedUser();
    setUserData(data.attributes);
  }

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

  const tryGetCoupons = async () => {

    const coupons = await API.graphql(graphqlOperation(listCoupons));
    console.log(`GRAPHQL > listCoupons = ${JSON.stringify(coupons,null,2)}`);
  }

  const tryObtainLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');      
      return;
    }
    console.log(`Location Permission Allowed!`);
    setLocationPermission(true);
  }

  const getCurrentStepDistMetric = async () => {
    const todayDate = new Date();
    console.log(`getCurrentStepDistMetric > START = ${todayDate.valueOf()}`);
    
    const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
    console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
    // let step1data = {...step1};
    let step1data = step1 as FWHealthData;
    step1data.valid = true;
    // setStepsData(step1data);
    
    const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
    console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
    let dist1data = res2 as FWHealthData;
    dist1data.valid = true;
    // setDistData(dist1data);
    console.log(`getCurrentStepDistMetric > END`);

    const location = await Location.getCurrentPositionAsync({});

    console.log(`Obtained Location = ${JSON.stringify(location,null,2)} @${(new Date()).valueOf()}`);

    // only calculate distance moved if not from first pass
    const distMoved = (prevStepData.id !== 0) ? distanceBetweenTwoPoints({lat: location.coords.latitude, lng: location.coords.longitude},
                                                {lat: prevStepData.latitude, lng: prevStepData.longitude}) 
                                                : 0;

    console.log(`DIST-MOVED = ${distMoved} @${(new Date()).valueOf()}`);
    let isDiffVerdict = true;
    // check whether current data is different to previous
    switch (true) {
      case (step1data.value !== prevStepData.dailySteps):
        break;
      case (dist1data.value !== prevStepData.dailyDist):
        break;
      case (distMoved > FWConstants.MINIMUM_DIST_MOVED):
      // case (location.coords.latitude !== prevStepData.latitude):
        // might need to relax later
        // break;
      // case (location.coords.longitude !== prevStepData.longitude):
        // might need to relax later
        console.log(`Larger movement than expected!`);
        break;
      default:
        isDiffVerdict = false;
        break;
    }

    if (isDiffVerdict) {    
      // prepare payload against previous payload
      const metricPayload:FWStepData = {
        id: Date.now(),
        email: userData.email,
        date: getISODaysAgoString(todayDate, 0),
        startTime: (prevStepData.id !== 0 ? prevStepData.endTime: todayDate.toISOString()), // previous timestamp
        endTime: todayDate.toISOString(), // this timestamp
        dailySteps: step1data.value,
        deltaSteps: (prevStepData.id !== 0 ? (step1data.value - prevStepData.dailySteps): 0),
        dailyDist: dist1data.value,
        deltaDist: (prevStepData.id !== 0 ? (dist1data.value - prevStepData.dailyDist): 0),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,  
        deltaLocDist: distMoved,
      }
      console.log(`FITWIN > current Metric Payload = ${JSON.stringify(metricPayload,null,2)}`);

      // send the payload
      try {
        const response = await API.graphql(
          graphqlOperation(createMetrics, { input: {...metricPayload} })
          );

        console.log(`GRAPHQL response = ${JSON.stringify(response,null,2)}`);

        if ('createdAt' in response || 'updatedAt' in response) { 
          console.log(`GRAPHQL MUTATION createMetrics Success!`);
        }       
      }
      catch (err) {
        console.log(err);
      }

      // save over to prevStepData
      setPrevStepData(metricPayload);
    }
    console.log(`getCurrentStepDistMetric > END END`);
  }

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    console.log(`FITWIN > Current Location = ${JSON.stringify(location,null,2)}`);
    setLocation(location);
  }

  const getWeekTotalSteps = () => {
    const todayObj = new Date();

    const todayStr = todayObj.toISOString().split('T')[0];
    console.log(`todayStr = ${todayStr}`);
    let _count = 0;

    for (let i = 0; i < FWConstants.SAMPLE_BATCH_DAYS; i += 1) {
      // going from today, query health kit for data and then set to store
      // const iDateObj = new Date(todayObj.valueOf() - (i * 24 * 60 * 60 * 1000));
      // const iDateStr = iDateObj.toISOString().split('T')[0];
      let iDateStr = getISODaysAgoString(todayObj, i);
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

  console.log(`Coupon number of  = ${coupons.length}`);
  const colors = ['tomato', 'thistle', 'skyblue', 'teal'];
  
  
    

  return (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      <ScrollView>
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>            
          <Text style={styles.sectionTitle}>Steps Goal Attained</Text>
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
        {distData.valid &&
        <>
          <Text style={styles.sectionTitle}>Distance Goal</Text>
          <Text style={styles.distText}>{distData.value} km</Text>
        </>
        }
        {
        <View>
          <Text style={styles.sectionTitle}>Coupons</Text>
          <SwiperFlatList
            autoplay
            autoplayDelay={2} 
            autoplayLoop index={0} 
            showPagination
            data={coupons}         
            renderItem={({ item }) => (
              <View style={[styles.slideChild, { backgroundColor: 'transparent' }]}>
                {/* <Text style={styles.slideText}>{item}</Text> */}
                <Image          
                  style={styles.slideImage}
                  source={{uri: `data:${item.contentType};base64,${item.imgData}`}}
                />
              </View>
            )}
          >
          </SwiperFlatList>
        </View>        
        }
        {false && coupons.length > 0 && 
          <>
            <Text style={styles.sectionTitle}>Coupons</Text>
            <Image
              // style={{width: coupons[0].width, height: coupons[0].height}}
              style={{width: 300, height: 200, resizeMode:"contain"}}
              source={{uri: `data:${coupons[0].contentType};base64,${coupons[0].imgData}`}}
            />
            <Image
              // style={{width: coupons[0].width, height: coupons[0].height}}
              style={{width: 300, height: 200, resizeMode:"contain"}}
              source={{uri: `data:${coupons[1].contentType};base64,${coupons[1].imgData}`}}
            />
          </>
        }
        {debugFrame && 
          <>
            <Text>{`Notification DB ${notificationDb.length} messages!`}</Text>
            <Text>{`Clicked ${count} times!`}</Text>
            <Button title="Increment" onPress={increment} />
            <Button title="Decrement" onPress={decrement} />
            <Button title="debugStepsStore" onPress={showStepsDB} />
            <Button title="showCurMetric" onPress={getCurrentStepDistMetric} />
            <Button title="getCurrentLocation" onPress={getCurrentLocation} />
            {/* <Button title="sendmetrics" onPress={sendMetrics} /> */}
          </>
        }
      </ScrollView>
    </SafeAreaView>
  </>
  );
});

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({    
  
  slideContainer: { flex: 1, backgroundColor: 'blue', width, height: 300},
  slideChild: { width, height: 300, justifyContent: 'center' },
  slideText: { fontSize: width * 0.2, textAlign: 'center' },  
  slideImage: {width, height: 200, resizeMode:"contain"},

  testContainer: { flex: 1, backgroundColor: 'blue', width, height: 300},

  baseText: {
    fontFamily: "Verdana-BoldItalic"
  },
  sectionTitle: {
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

