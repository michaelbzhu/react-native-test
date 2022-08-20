import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import tw from 'twrnc';
import { Link } from "react-router-native";
import * as web3 from "@solana/web3.js";


export function Home({ navigation }) { 

  useEffect(() => {
    // const randomKeypair = () => {
      console.log(web3.Keypair.generate());
    // };
  }, [])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-col items-center justify-center h-full w-full`}>
        <View style={tw`flex-col items-center justify-between h-4/12 w-9/12`}>
          <Text category='h2'>Welcome Back</Text>
          <View style={tw`flex-col items-center justify-around w-full h-6/12`}>
          </View>
          <StatusBar style="auto" />
          <Button status='primary' style={tw`w-1/2`}>Log In</Button>
          <View style={tw`flex-row`}>
            <Text category="s1">Don't have an account? </Text>
            <Link to="/"><Text style={tw`underline`} >Sign Up</Text></Link>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )


}