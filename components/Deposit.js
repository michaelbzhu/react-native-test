import { StatusBar } from "expo-status-bar"
import { useState, useEffect } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
  Clipboard,
} from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import tw from "twrnc"
import { Link, useNavigate, useLocation } from "react-router-native"
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components"
import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { encodeURL, createQR } from "@solana/pay"
import BigNumber from "bignumber.js"
import { usePublicKey } from "../hooks/usePublicKey"

export function Deposit() {
  const location = useLocation()
  const navigate = useNavigate()
  const dashboardArr = ["/", "/pay", "/deposit"]
  const [selectedIndex, setSelectedIndex] = useState(2)
  const { publicKey, userBalance } = usePublicKey()

  const [QRUrl, setQRUrl] = useState(null)

  async function updateQRCode() {
    // Variable to keep state of the payment status
    let paymentStatus

    // Connecting to devnet for this example
    console.log("1. ✅ Establish connection to the network")
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

    // -- snippet -- //

    /**
     * Simulate a checkout experience
     *
     * Recommendation:
     * `amount` and `reference` should be created in a trusted environment (server).
     * The `reference` should be unique to a single customer session,
     * and will be used to find and validate the payment in the future.
     *
     */
    console.log("2. 🛍 Simulate a customer checkout \n")
    const recipient = new PublicKey("MERCHANT_WALLET")
    const amount = new BigNumber(20)
    const reference = new Keypair().publicKey
    const label = "Jungle Cats store"
    const message = "Jungle Cats store - your order - #001234"
    const memo = "JC#4098"

    /**
     * Create a payment request link
     *
     * Solana Pay uses a standard URL scheme across wallets for native SOL and SPL Token payments.
     * Several parameters are encoded within the link representing an intent to collect payment from a customer.
     */
    console.log("3. 💰 Create a payment request link \n")
    const url = encodeURL({ recipient, amount, reference, label, message, memo })

    const qrInfo = encodeURIComponent(url.toString())
    setQRUrl(qrInfo)
  }

  return (
    <View style={tw`flex-col h-11/12 w-full justify-center items-center bg-slate-100 pt-12`}>
      <ScrollView style={tw`flex-col w-full p-4`}>
        <View style={tw`flex-col items-center justify-center mb-3`}>
          <Text category="h5">CUBEPay Balance:</Text>
          <Text category="h2" style={tw`text-blue-600`}>
            ${userBalance}
          </Text>

          <Text category="h4" style={tw`pt-30`}>
            Wallet address:
          </Text>

          <Text category="h3" style={tw`py-5`} onPress={() => Clipboard.setString(publicKey.toString())}>
            {publicKey && publicKey.toString()}
          </Text>

          {/* <TextInput placeholder="0" keyboardType="number-pad" style={tw`text-5xl`}></TextInput> */}
        </View>
      </ScrollView>
    </View>
  )
}
