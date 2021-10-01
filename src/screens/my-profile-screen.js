import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
// import PreferenceScreen from './preferences-screen';

const MyProfile = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate('PreferenceScreen')
                }}
                underlayColor="white">
                <View style={styles.button}>
                    <Text style={styles.buttonText}>
                        <Icon
                            style={styles.iconSpacing}
                            name={'shoppingcart'} size={20} color="#000000" /> Preferences
                           <Fontawesome
                            style={styles.iconRightSpacing}
                            name={'angle-right'} size={20} color="#000000" />

                    </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                // onPress={this._onPressButton} 
                underlayColor="white">
                <View style={styles.button}>

                    <Text style={styles.buttonText}>
                        <Icon
                            style={styles.iconSpacing}
                            name={'message1'} size={20} color="#000000" /> Support
                                                       <Fontawesome
                            style={styles.iconRightSpacing}
                            name={'angle-right'} size={20} color="#000000" />

                    </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                // onPress={this._onPressButton} 
                underlayColor="white">
                <View style={styles.button}>

                    <Text style={styles.buttonText}>
                        <Icon
                            style={styles.iconSpacing}
                            name={'bells'} size={20} color="#000000" />
                        Notifications
                        <Fontawesome
                            style={styles.iconRightSpacing}
                            name={'angle-right'} size={20} color="#000000" />
                    </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                // onPress={this._onPressButton} 
                underlayColor="white">
                <View style={styles.button}>
                    <Text style={styles.buttonText}> <Icon
                        style={styles.iconSpacing}
                        name={'info'} size={20} color="#000000" /> 
                        About
                        <Fontawesome
                            style={styles.iconRightSpacing}
                            name={'angle-right'} size={20} color="#000000" />

                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        alignItems: 'center'
    },
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomColor: 'grey',
        borderBottomWidth: 1.5,

    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'grey',
        fontWeight: 'bold',
    },
    iconSpacing: {
        marginRight: 5,
        position: 'absolute',
        left: 20
    },
    iconRightSpacing: {
        marginRight: 5,
        position: 'absolute',
        right: 5
    }
});
export default MyProfile;