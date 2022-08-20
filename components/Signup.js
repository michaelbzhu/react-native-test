import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import tw from 'twrnc';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link } from "react-router-native";

export function Signup({ navigation }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-col items-center justify-center h-full w-full`}>
          <View style={tw`flex-col items-center justify-between h-4/12 w-9/12`}>
            <Text category='h2'>Join RoamPay</Text>
            <View style={tw`flex-col items-center justify-around w-full h-6/12`}>
              <Input label='Email' placeholder='Email' value={email} onChangeText={nextValue => setEmail(nextValue)}></Input>
              <Input label='Password' placeholder='Password' value={password} onChangeText={nextValue => setPassword(nextValue)}></Input>
            </View>
            <StatusBar style="auto" />
            <Button status='primary' style={tw`w-1/2`}>Sign Up</Button>
            <View style={tw`flex-row`}>
              <Text category="s1">Already a Roamer? </Text>
              <Link to="login"><Text style={tw`underline`} >Log In</Text></Link>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ApplicationProvider>
  )
}