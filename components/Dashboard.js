
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import tw from 'twrnc';
import { Link, useNavigate, useLocation } from "react-router-native";
import * as web3 from "@solana/web3.js";
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';



export function Dashboard () {
 return (
    <View style={tw`flex-col h-11/12 w-full justify-center items-center bg-slate-100 pt-12`} >
      <ScrollView style={tw`flex-col w-full p-4`}>
          <View style={tw`flex-col items-center justify-center mb-3`}>
            <Text category='h5'>CUBEPay Balance:</Text>
            <Text category='h2' style={tw`text-blue-600`}>$6,341</Text>
          </View>
          <View style={tw`flex-col items-center justify-start`}>
            <Text style={tw`self-start ml-3 mb-1`}>RECENT TRANSACTIONS</Text>
            <View style={tw`bg-white w-full rounded-2xl`}>
              <Text>Tx here</Text>
            </View>
          </View>
      </ScrollView>
    </View>
 )
}