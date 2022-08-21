import { StatusBar } from "expo-status-bar"
import { useState, useEffect } from "react"
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import tw from "twrnc"
import { Link, useNavigate, useLocation } from "react-router-native"
import * as web3 from "@solana/web3.js"
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components"
import { Pay } from "./Pay"
import { Deposit } from "./Deposit"
import { Dashboard } from "./Dashboard"
import { usePublicKey } from "../hooks/usePublicKey"
import { useSecretKey } from "../hooks/useSecretKey"

export function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tx, setTx] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const publicKey = usePublicKey()
  const secretKey = useSecretKey()
  console.log({ publicKey, secretKey })

  const renderTransactions = () => {
    return <View></View>
  }

  const dashboardArr = ["/", "/pay", "/deposit"]

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={tw`flex-col items-center h-full w-full bg-slate-100`}>
      {selectedIndex === 0 && <Dashboard />}
      {selectedIndex === 1 && <Pay />}
      {selectedIndex === 2 && <Deposit />}
      <BottomNavigation
        style={tw`h-1/12 pb-5`}
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          setSelectedIndex(index)
        }}
      >
        <BottomNavigationTab title="Dashboard" />
        <BottomNavigationTab title="Pay" />
        <BottomNavigationTab title="Deposit" />
      </BottomNavigation>
    </View>
    // </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 10,
  },
})
