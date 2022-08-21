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
import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { encodeURL, createQR } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";
import { keyboardProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


export function MerchantPay() {

  const [inputAmount, setInputAmount] = useState('');
  const [connection, setConnection] = useState(null);
  const [QRUrl, setQRUrl] = useState(null);
  const [showQR, setShowQR] = useState(false)
  const auth = getAuth();
  const userUID = auth.currentUser?.uid;

  // async function getPublicKeyofMerchant() {
  //   const defaultPublicKey = new PublicKey('9sgcecPQ1dNvfHZwiAhEuZKw8AJVyvab5AthHt3vBAuw')
  //   if (!userUID) return defaultPublicKey
  //   const docRef = doc(db, "wallets", userUID);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //     const merchantPublicKey = docSnap.data()?.publicKey
  //     return merchantPublicKey ? new PublicKey(merchantPublicKey) : defaultPublicKey
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //     return defaultPublicKey
  //   }
  // }
  




  useEffect(() => {
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'processed');

    // const qrCode = createQR(url);

  }, [])

  const generateQR = () => {

    const recipient = new PublicKey('9sgcecPQ1dNvfHZwiAhEuZKw8AJVyvab5AthHt3vBAuw');
    const amount = new BigNumber(20);
    const reference = new Keypair().publicKey;
    const label = 'Jungle Cats store';
    const message = 'Jungle Cats store - your order - #001234';
    const memo = 'JC#4098';
    const splToken = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    /**
     * Create a payment request link
     *
     * Solana Pay uses a standard URL scheme across wallets for native SOL and SPL Token payments.
     * Several parameters are encoded within the link representing an intent to collect payment from a customer.
     */

    const url = encodeURL({ recipient, amount, splToken, reference, label, message, memo });


    console.log("YO", url)
    console.log("YO", encodeURIComponent("solana:https://loose-hoops-stick-12-202-1-227.loca.lt"))
    setQRUrl(encodeURIComponent("solana:https://loose-hoops-stick-12-202-1-227.loca.lt"));
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-col h-11/12 w-full justify-around items-center bg-slate-100`} >
        <View style={tw`h-7/12 justify-around items-center flex-col w-full`}>
          <Text category='h3'>It's time to get paid.</Text>
          <View style={tw`w-7/12`}>
            <Input label='How much are you requesting?' placeholder='Amount (in USDC)' value={inputAmount} onChangeText={nextValue => setInputAmount(nextValue)}></Input>
          </View>
          <Button status='primary' style={tw`w-8/12`} onPress={generateQR}>Generate QR Code</Button>
          {QRUrl && <QRCode
            value={QRUrl}
          />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}