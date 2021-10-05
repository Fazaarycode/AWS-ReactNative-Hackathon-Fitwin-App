import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, TouchableOpacity , Image, View, Text} from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getCoupons } from '../graphql/queries';

// Victory stuff
import * as V from 'victory';
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";


// Victory stuff
let interval;

const HomeScreen = (props) => {
  // const [userData, setUserData] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  // Victory stuff
  let [percent, setPercent]  = useState(0); // Set initial value for your Animation
  // Victory stuff
  let [data, setData]  = useState([]);

  // Victory stuff
  const getData = percent =>  {
    return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
  }

  // Victory stuff
  useEffect(() => {
    interval = setInterval(() => {
      percent += (10); // This will be Delta of Progress towards Target between Current and previous step count
      if(percent >= 100) {
        percent = 100;
        clearInterval(interval)
      }
      setData(getData(percent));
      setPercent(percent);
      // console.log(percent)
    }, 2000);

  }, []); 

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
        {/* Victory stuff */}
      <svg viewBox="0 0 400 400" width="100%" height="100%">
          <VictoryPie
            standalone={false}
            animate={{ duration: 1000 }}
            width={400} height={400}
            data={data}
            innerRadius={120}
            cornerRadius={25}
            labels={() => null}
            style={{
              data: { fill: ({ datum }) => {
                const color = datum.y > 30 ? "green" : "red";
                // console.log(datum)
                return datum.x === 1 ? color : "transparent";
              }
              }
            }}
          />
          <VictoryAnimation duration={1000} >
            {() => {
              return (
                <VictoryLabel
                  textAnchor="middle" verticalAnchor="middle"
                  x={200} y={200}
                  text={`${Math.round(percent)}%`}
                  style={{ fontSize: 45 }}
                />
              );
            }}
          </VictoryAnimation>
        </svg>
      {/* Victory stuff */}

      </View>
    </>
  );
};
export default HomeScreen;