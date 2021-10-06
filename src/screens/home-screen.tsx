import React, {useEffect, useState} from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import {SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity, View, Button, Image, Dimensions, ScrollView} from 'react-native';
import { FWCoupon, FWHealthData, FWHealthTarget, FWStepData, FWUserData } from '../utils/HealthDataTypes';
import AppleHealthKitWrapper from '../utils/AppleHealthKitWrapper';
import * as Location from 'expo-location';
// import {CircularProgressBar} from '../components/CircularProgressBar';

// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';


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

import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
  VictoryPie,
  VictoryAnimation,
  VictoryLabel,
// } from 'victory';
} from 'victory-native';

import { useDistStore } from '../utils/dist.store';

//====================================================================================================
const BACKGROUND_FETCH_TASK = 'background-fetch';

const debugFrame = true;
const debugUI = false;
const debugUser = true;
const debugNotif = true;
const debugHealthKit = false;
const debugSendMetric = false;
const debugBarcharts = false;
const debugLocation = false;
const debugStorage = false;
const debugCoupons = true;

//====================================================================================================

const HomeScreen = observer((props) => {
  
  const [userData, setUserData] = useState<FWUserData|undefined>();
  const { count, devToken, increment, decrement } = useCounterStore(); // OR useContext(CounterStoreContext)
  const { stepsDb, setSteps, getSteps } = useStepStore(); // 
  const { distDb, setDist, getDist } = useDistStore(); // 
  const { notificationDb, notificationCount, popNotification, tryPop } = useNotificationStore(); // OR useContext(CounterStoreContext)
  const [location, setLocation] = useState(null);
  // const [locationPermission, setLocationPermission] = useState(false);

  const loadInitialCoupons = ():FWCoupon[] => {
    const {coupons} = configData;
    
    const couponsTyped = coupons.map((x:any) => x as FWCoupon);
    return couponsTyped;
  }

  const getInitialStepData = ():FWStepData => {
    return {
      id: 0,
      email: "",
      date: "",
      startTime: "",
      endTime: "",
      dailySteps: 0,
      deltaSteps: 0,
      dailyDist: 0,
      deltaDist: 0,
      latitude: 0,
      longitude: 0,
      deltaLocDist: 0,
      deviceToken: '',
    };
  }
  
  const [stepsData, setStepsData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  const [distData, setDistData] = useState<FWHealthData>({valid: false, value: 0, startDate: null, endDate: null});
  // const [coupons, setCoupons] = useState(loadInitialCoupons());
  const [couponImages, setCouponImages] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [prevStepData, setPrevStepData] = useState(getInitialStepData());
  const [timeLeft, setTimeLeft] = useState(0);
  const [gBarChartData, setGBarChartData] = useState<any>();

  useEffect(() => {
    if (debugUI) console.log(`FITWIN > HomeScreen > START`);

    fetchUserData();

    tryInitAppleHealthKit();
    // refreshHealthData();

    tryObtainLocationPermission();

    // initCouponImagesFromStorage();

    if (debugUI) console.log(`FITWIN > HomeScreen > END`);

  }, []);

  useEffect(() => {
    // userData has changed
    if (debugUser) console.log(`FITWIN > User Changed START`);
    if (userData) {
      console.log(`FITWIN > user = ${userData.username}, ${userData.email}`);
      // let's kick off the timer for sending data
      setTimeLeft(10);

      // load coupons
      tryGetCoupons();
    }
    if (debugUser) console.log(`FITWIN > User Changed END`);
  }, [userData]);

  // for notif
  useEffect(() => {
    if (debugNotif) console.log(`FITWIN > NEW Notificaiton changes! START`);
    if (debugNotif) console.log(JSON.stringify(notificationDb,null,2));

    // try pop
    const thisNotif = tryPop();
    if (thisNotif) {
      if (debugNotif) console.log(`Show Toast!`);
      // popNotification();
    }
    
    if (debugNotif) console.log(`FITWIN > NEW Notificaiton changes! END`);
  }, [notificationCount]);

  const calculateTimeLeft = () => {
    return timeLeft + 10; // increment 10s to cause 
  }

  // timer for sending data
  useEffect(() => {
    let timer:NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout( async () => {

        // execute an update action
        const {statsChanged, locationChanged} = await getCurrentStepDistMetric();

        if (debugSendMetric) console.log(`useEffect[timeLeft] > getCurrentStepDistMetric > {${statsChanged},${locationChanged}}`);

        if (statsChanged) {
          const barChartData = await getWeekHealthData();
          console.log(`💜💜💜💜 barChartData changed! => ${JSON.stringify(barChartData,null,2)}`);
          setGBarChartData(barChartData);
        }

        // house keeping
        const thisTimeLeft = calculateTimeLeft();
        setTimeLeft(thisTimeLeft);
        console.log(`Timer executed 🧡🧡🧡🧡`);
      }, FWConstants.PERIOD_SEND_HEALTHDATE);
    }    
    else {
      console.log(`Timer Expired! ⏰⏰⏰⏰`);
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
    if (debugUser) console.log(`🏠🏠🏠 User Data > ${JSON.stringify(data,null,2)}`);
    
    setUserData({
      username: data.username,
      email: data.attributes.email,
      sub: data.attributes.sub
    });
  }

  const tryInitAppleHealthKit = async () => {

    if (debugHealthKit) console.log(`tryInitAppleHealthKit START`);

    await AppleHealthKitWrapper.init();
    await AppleHealthKitWrapper.getAuthStatus();

    // const todayDate = new Date();
    // let yesterdayDate = new Date();
    // yesterdayDate.setDate(todayDate.getDate() - 1);

    const todayObj = new Date();

    const todayStr = todayObj.toISOString().split('T')[0];
    if (debugHealthKit) console.log(`todayStr = ${todayStr}`);
    
    for (let i = 0; i < 10; i += 1) {
      // going from today, query health kit for data and then set to store
      const iDateObj = new Date(todayObj.valueOf() - (i * 24 * 60 * 60 * 1000));
      const iDateStr = iDateObj.toISOString().split('T')[0];
      if (debugHealthKit) console.log(`${i} dateLabelStr = ${iDateStr}`);

      const iStep = await AppleHealthKitWrapper.getStepCount(iDateObj);
      if (debugHealthKit) console.log(`${i} HealthKit: stepCount=${JSON.stringify(iStep,null,2)}`);      
      let iStepHealthData = iStep as FWHealthData;

      setSteps(iDateStr, iStepHealthData.value);

      const iDist = await AppleHealthKitWrapper.getDistanceWalkingRunning(iDateObj);
      if (debugHealthKit) console.log(`${i} HealthKit: DistanceWalkingRunning=${JSON.stringify(iDist,null,2)}`);      
      let iDistHealthData = iDist as FWHealthData;
      setDist(iDateStr, iDistHealthData.value);
    }

    // build the graph
    const barChartData = await getWeekHealthData();
    if (debugBarcharts) console.log(`💙💙💙💙 barChartData initialized => ${JSON.stringify(barChartData,null,2)}`);
    setGBarChartData(barChartData);
    
    const todayDate = new Date('2021-10-03');
    const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
    if (debugHealthKit) console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
    // let step1data = {...step1};
    let step1data = step1 as FWHealthData;
    step1data.valid = true;
    setStepsData(step1data);
    
    const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
    if (debugHealthKit) console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
    let dist1data = res2 as FWHealthData;
    dist1data.valid = true;
    setDistData(dist1data);

    if (debugHealthKit) console.log(`tryInitAppleHealthKit END`);
    
  }

  const initCouponImagesFromStorage = async () => {
    
    // const result = await Storage.get('coupon1.png', { level: 'public' });
    // if (debugCoupons) console.log(`initCouponImagesFromStorage > ${JSON.stringify(result,null,2)}`);

    // get all the coupons in bucket 
    try {
      const _coupons = await Storage.list('coupons/');
      if (debugStorage) console.log(`initCouponImagesFromStorage > promise all coupons = ${JSON.stringify(_coupons,null,2)}`);

      let _bucketCouponsList = [];
      let p = [];

      for (let i = 0; i < _coupons.length; i += 1) {
        p.push(Storage.get(_coupons[i].key, { level: 'public' }));
      }

      // wait until all the results are back
      const resArray = await Promise.all(p);

      for (let k = 0; k < _coupons.length; k += 1) {
        _bucketCouponsList.push({
          _url: resArray[k],
          item: _coupons[k],
        });
      }

      if (debugStorage) console.log(`ALL COUPONS > ${JSON.stringify(_bucketCouponsList,null,2)}`);
      setCouponImages(_bucketCouponsList);
    }
    catch (err) {
      console.log(err);
    }
   
  }

  const tryGetCoupons = async () => {

    let _queryResponse:any;

    if (userData && userData?.username != '') {
      const _filter = {
        name: {
          eq: userData.username
        }
      }
    
      _queryResponse = await API.graphql({query: listCoupons, variables: { filter: _filter}});
      if (debugCoupons) console.log(`GRAPHQL USER > listCoupons [${userData.username}]= ${JSON.stringify(_queryResponse,null,2)}`);
    }
    else {
      _queryResponse = await API.graphql(graphqlOperation(listCoupons));
      if (debugCoupons) console.log(`GRAPHQL ALL > listCoupons = ${JSON.stringify(_queryResponse,null,2)}`);
    }

    try {
      let _userCoupons = JSON.parse(JSON.stringify(_queryResponse.data.listCoupons.items));
      
      let p = [];

      for (let i = 0; i < _userCoupons.length; i += 1) {
        p.push(Storage.get(_userCoupons[i].imgData, { level: 'public' }));
      }

      // wait until all the results are back
      const resArray = await Promise.all(p);
      console.log(`resArray>${JSON.stringify(resArray,null,2)}`);
      for (let k = 0; k < _userCoupons.length; k += 1) {
        _userCoupons[k]._url = resArray[k];
      }

      if (debugCoupons) console.log(`truGetCoupons user final > ${JSON.stringify(_userCoupons,null,2)}`);
      setUserCoupons(_userCoupons);
    }
    catch (err) {
      console.log(err);
    }

  }

  const tryObtainLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');      
      return;
    }
    if (debugLocation) console.log(`Location Permission Allowed!`);
    // setLocationPermission(true);
  }

  const getCurrentStepDistMetric = async () => {
    const todayDate = new Date();
    if (debugSendMetric) console.log(`getCurrentStepDistMetric > START = ${todayDate.valueOf()}`);
    
    const step1 = await AppleHealthKitWrapper.getStepCount(todayDate);
    if (debugSendMetric) console.log(`HealthKit: stepCount=${JSON.stringify(step1,null,2)}`);
    // let step1data = {...step1};
    let step1data = step1 as FWHealthData;
    step1data.valid = true;
    // setStepsData(step1data);
    
    const res2 = await AppleHealthKitWrapper.getDistanceWalkingRunning(todayDate);
    if (debugSendMetric) console.log(`HealthKit: dist walking running=${JSON.stringify(res2,null,2)}`);
    let dist1data = res2 as FWHealthData;
    dist1data.valid = true;
    // setDistData(dist1data);
    if (debugSendMetric) console.log(`getCurrentStepDistMetric > END`);

    const location = await Location.getCurrentPositionAsync({});

    if (debugLocation) console.log(`Obtained Location = ${JSON.stringify(location,null,2)} @${(new Date()).valueOf()}`);

    // only calculate distance moved if not from first pass
    const distMoved = (prevStepData.id !== 0) ? distanceBetweenTwoPoints({lat: location.coords.latitude, lng: location.coords.longitude},
                                                {lat: prevStepData.latitude, lng: prevStepData.longitude}) 
                                                : 0;

    if (debugSendMetric) console.log(`DIST-MOVED = ${distMoved} @${(new Date()).valueOf()}`);
    
    let _statsChanged = 0;
    let _locationChanged = 0;

    if ((step1data.value !== prevStepData.dailySteps) || (dist1data.value !== prevStepData.dailyDist)) {
      _statsChanged += 1;
    }

    if (distMoved > FWConstants.MINIMUM_DIST_MOVED) {
      _locationChanged += 1;
      console.log(`Larger movement than expected!`);
    }

    if ((_statsChanged + _locationChanged) > 0) {
     
      // check email 
      if (userData) {

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
          deviceToken: devToken,
        }
        if (debugSendMetric) console.log(`FITWIN > current Metric Payload = ${JSON.stringify(metricPayload,null,2)}`);

        // send the payload
        try {
          const response = await API.graphql(
            graphqlOperation(createMetrics, { input: {...metricPayload} })
            );

            if (debugSendMetric) console.log(`GRAPHQL response = ${JSON.stringify(response,null,2)}`);

          let graphQLok = false;
          if ('data' in response && 'createMetrics' in response.data) {
            // console.log(`GRAPHQL data reponse 1`);
            const replyPayload = response.data['createMetrics'] as FWStepData;
            // console.log(`GRAPHQL data reponse 2 > ${JSON.stringify(replyPayload,null,2)}`);
            if (!!replyPayload?.createdAt && !!replyPayload?.updatedAt && replyPayload?.owner) {
              console.log(`GRAPHQL mutation success! ✅✅✅✅`);
              graphQLok = true;
            }
          }

          if (!graphQLok) {
            console.log(`GRAPHQL mutation success! ❌❌❌❌`);
          }

        }
        catch (err) {
          console.log(err);
        } // end try

        // save over to prevStepData
        setPrevStepData(metricPayload);
      } // end if userData
      //else {
      // userData is invalid --> don't update previous data
      //}

    } // if data changed
    
    if (debugSendMetric) console.log(`getCurrentStepDistMetric > END END`);
    return {
      statsChanged: (_statsChanged > 0),
      locationChanged: (_locationChanged > 0),
    };
  } 

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    if (debugLocation) console.log(`FITWIN > Current Location = ${JSON.stringify(location,null,2)}`);
    setLocation(location);
  }

  const getWeekHealthData = async () => {
    const todayObj = new Date();

    const todayStr = getISODaysAgoString(todayObj, 0);
    if (debugBarcharts) console.log(`todayStr = ${todayStr}`);

    let barChartData = {
      steps: [],
      dists: [],
    }

    for (let i = 0; i < FWConstants.SAMPLE_BATCH_DAYS; i += 1) {
      // going from today, query health kit for data and then set to store
      const iDateObj = new Date(todayObj.valueOf() - (i * 24 * 60 * 60 * 1000));
      const iDateStr = iDateObj.toISOString().split('T')[0];
      if (debugBarcharts) console.log(`${i} dateLabelStr = ${iDateStr}`);

      // get step count
      const iStep = await AppleHealthKitWrapper.getStepCount(iDateObj);
      if (debugBarcharts) console.log(`${i} HealthKit: stepCount=${JSON.stringify(iStep,null,2)}`);      
      const iStepHealthData = iStep as FWHealthData;

      const iDist = await AppleHealthKitWrapper.getDistanceWalkingRunning(iDateObj);
      if (debugBarcharts) console.log(`${i} HealthKit: dist walking running=${JSON.stringify(iDist,null,2)}`);
      const iDistHealthData = iDist as FWHealthData;
      
      const dayOfTheWeek = iDateObj.getDay(); // Sunday - Saturday : 0 - 6

      let dayOfTheWeekStr = '';
      switch (dayOfTheWeek) {
        case 0: dayOfTheWeekStr = "Sun"; break;
        case 1: dayOfTheWeekStr = "Mon"; break;
        case 2: dayOfTheWeekStr = "Tue"; break;
        case 3: dayOfTheWeekStr = "Wed"; break;
        case 4: dayOfTheWeekStr = "Thu"; break;
        case 5: dayOfTheWeekStr = "Fri"; break;
        case 6: dayOfTheWeekStr = "Sat"; break;
        default: break;
      }

      barChartData.steps.unshift({x: dayOfTheWeekStr, y: Math.floor(iStepHealthData.value)});
      barChartData.dists.unshift({x: dayOfTheWeekStr, y: Math.floor(iDistHealthData.value / 1000)});
      
    }

    if (debugBarcharts) console.log(`barChartData = ${JSON.stringify(barChartData,null,2)}`);
    return barChartData;
  }


  const showStepsDB = () => {
    const keys = Object.keys(stepsDb);
    console.log(`showStepsDb = ${JSON.stringify(keys,null,2)}`);
    for (let k = 0; k < keys.length; k += 1) {
      // print stepsDb
      console.log(`db[${keys[k]}] val=${stepsDb[keys[k]]}`);
    }
  }


  const stepsInAWeek = 100;//getWeekHealthData();
  if (debugUI) console.log(`John > 1 week of steps = ${stepsInAWeek}`);

  const stepsPercent = Math.floor(stepsInAWeek * 100 / stepsTarget.targetValue);
    
  //====================================================================================================
  // Graph related
  //====================================================================================================

  // setup charts
  const chartData = {
    labels: ["Step"], // optional
    data: [stepsPercent]
  };

  const barChartData1:any =
  {
    "steps": [
      {x: "Wed", y: 134},
      {x: "Thu", y: 0},
      {x: "Fri", y: 0},
      {x: "Sat", y: 80},
      {x: "Sun", y: 170},
      {x: "Mon", y: 44},
      {x: "Tue", y: 205}
    ],
    "dists": [
      {x: "Wed", y: 100},
      {x: "Thu", y: 5},
      {x: "Fri", y: 10},
      {x: "Sat", y: 0},
      {x: "Sun", y: 1},
      {x: "Mon", y: 27},
      {x: "Tue", y: 25}
    ]
  };

  const vGraphAxisStyle = {
    axis: {stroke: "#bebebe", fill: '#bebebe',},
    axisLabel: {
      padding: 35,
      fill: '#bebebe',
      stroke: '#bebebe',
      fontFamily: 'Verdana',
      fontSize: 15,
    },
    ticks: {stroke: "#bebebe", fill: '#bebebe', size: 5},
    tickLabels: {stroke: "#bebebe", fill: '#bebebe', size: 10}
  };
    
  const vGraph = (gBarChartData &&
    <View style={{
      // backgroundColor: '#fafafa',
      backgroundColor: 'transparent',
      paddingTop: 10,
      borderRadius: 25,
      margin: 20,
    }}>
    <VictoryChart
      domainPadding={{ x: 15 }}   
    >
      <VictoryAxis 
        label="Week" 
        style={vGraphAxisStyle}
      />
      <VictoryAxis
        dependentAxis
        label="Count"
        style={vGraphAxisStyle}
      />

      <VictoryGroup offset={10}>
        <VictoryBar
          data={gBarChartData.steps}
          // x={'day'}
          // y={'val'}
          style={{
            data: {
              fill: "#e66084",
            },
          }}
        />     
        <VictoryBar
          data={gBarChartData.dists}
          // x={'day'}
          // y={'val'}
          style={{
            data: {
              fill: "#5344c2", //blue-ish
            },
          }}
        />
      </VictoryGroup>
      <VictoryLegend
        x={Dimensions.get('screen').width / 2 -100}
        orientation="horizontal"
        gutter={20}
        data={[
          {
            name: 'Steps',
            symbol: {
              fill: '#e66084',
            },
          },
          {
            name: 'Distance (km)',
            symbol: {
              fill: '#5344c2', //blue-ish
            },
          },
        ]}
      />
    </VictoryChart>
    </View>
  );

  //====================================================================================================
  // render()
  //====================================================================================================

  return (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      <ScrollView style={{backgroundColor: '#1f3690'}}>
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>            
          <Text style={styles.userNameTitle}>{userData?.username||'User'}</Text>
          {/* <ProgressChart
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
          </View> */}
          
          {vGraph}
          
        </View>
        
        {
        <View>
          <Text style={styles.sectionTitle}>Coupons</Text>
          {/* <SwiperFlatList
            autoplay
            autoplayDelay={2} 
            autoplayLoop index={0} 
            showPagination
            data={coupons}         
            renderItem={({ item }) => (
              <View style={[styles.slideChild, { backgroundColor: 'transparent' }]}>                
                <Image          
                  style={styles.slideImage}
                  source={{uri: `data:${item.contentType};base64,${item.imgData}`}}
                />
              </View>
            )}
          >
          </SwiperFlatList> */}
          <SwiperFlatList
            // autoplay
            // autoplayDelay={2} 
            // autoplayLoop index={0} 
            showPagination
            data={userCoupons}         
            renderItem={({ item }) => (
              <View style={[styles.slideChild, { backgroundColor: 'transparent' }]}>                
                <Image          
                  style={styles.slideImage}
                  // source={{uri: `data:${item.contentType};base64,${item.imgData}`}}
                  source={{
                    uri: item._url
                  }}
                />
              </View>
            )}
          >
          </SwiperFlatList>
        </View>        
        }
        
        {debugFrame && 
          <>
            <Text>{`Notification DB ${notificationDb.length} messages!`}</Text>
            <Text>{`Clicked ${count} times!`}</Text>
            <Button title="initCouponImagesFromStorage" onPress={initCouponImagesFromStorage} />
            <Button title="tryGetCoupons" onPress={tryGetCoupons} />
            <Button title="getWeekHealthData" onPress={getWeekHealthData} />
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

//====================================================================================================
// Styles
//====================================================================================================

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
  userNameTitle: {
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "500",
    fontFamily: "Verdana",
    textAlign: "left",
    // color: "#e5ebf2",
    color: "#bebebe",
    marginLeft: 40,
  },  
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    textAlign: "center",
    color: "#bebebe",    
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
  },
  stepText2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",
    textAlign: "right",
  },
  distText: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "Verdana-BoldItalic",    
    backgroundColor: "pink",
  }
});

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

