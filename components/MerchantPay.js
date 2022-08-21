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



export function MerchantPay() {

  const [inputAmount, setInputAmount] = useState('');


  return (
    <View style={tw`flex-col h-11/12 w-full justify-around items-center bg-slate-100`} >
      <View style={tw`h-3/6 justify-around items-center flex-col w-full`}>
        <Text category='h3'>It's time to get paid.</Text>
        <View style={tw`w-7/12`}>
          <Input label='How much are you requesting?' placeholder='Amount (in USDC)' value={inputAmount} onChangeText={nextValue => setInputAmount(nextValue)}></Input>
        </View>
        <Button status='primary' style={tw`w-8/12`}>Generate QR Code</Button>
      </View>
    </View>
  )
}