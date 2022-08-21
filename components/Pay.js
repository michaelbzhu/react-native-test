import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import tw from 'twrnc';
import { Link, useNavigate, useLocation } from "react-router-native";
import * as web3 from "@solana/web3.js";
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';



export function Pay() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const closeIcon = (props) => {
    return <Icon {...props} name="close-outline" style={{ width: 32, height: 32, color: 'white' }}></Icon>
  }


  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(typeof data)
    console.log("yo, type, data", type, decodeURIComponent(data))
    setOpenCamera(false);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  

  return (
    <View style={tw`flex-col h-11/12 w-full justify-center items-center bg-slate-100`} >
      {openCamera ? 
        (
          <View style={tw`flex-col w-full`}><BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={tw`h-full w-full bg-black z-0`}
          />
          <Button style={tw`mt-7 ml-2 absolute bg-transparent border-2`} onPress={() => {setOpenCamera(false)}} accessoryLeft={closeIcon}></Button></View>
        ) : (
          <View style={tw`h-3/12`}>
            <ScrollView style={tw`flex-col w-full p-4`}>
              <View style={tw`flex-col items-center justify-center mb-3`}>
                <Text category='h5'>CUBEPay Balance:</Text>
                <Text category='h2' style={tw`text-blue-600`}>$6,341</Text>
              </View>
              <Button onPress={() => setOpenCamera(true)}>Scan QR Code and Pay</Button>
              {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </ScrollView>
          </View>
        )
      }
    </View>
  )
}