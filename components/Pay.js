import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView, Modal, ImageBackground, Image } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import tw from 'twrnc';
import { Link, useNavigate, useLocation } from "react-router-native";
import * as web3 from "@solana/web3.js";
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { encodeURL, parseURL } from '@solana/pay';
// import { Connection } from '@solana/web3.js/lib/index.cjs';
import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { Buffer } from "buffer";
import { usePublicKey } from "../hooks/usePublicKey"
import { useSecretKey } from "../hooks/useSecretKey"
import 'text-encoding-polyfill'
import paradise from "../assets/Paradise.jpeg"
import { AccountLayout, getAssociatedTokenAddress } from '@solana/spl-token';
import BigNumber from "bignumber.js";
import BN from "bn.js";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import logo from "../assets/logo.png"

export function Pay() {

  const { publicKey, userBalance } = usePublicKey();
  const secretKey = useSecretKey();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [connection, setConnection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const USDC_MINT_ADDR = new PublicKey("6L61933r4BBMJwoejjCZeJtDWouTtgvVAokDiSqyt4DQ")
  const [simulatedTokenDiff, setSimulatedTokenDiff] = useState(null)
  const [unconfirmedTx, setUnconfirmedTx] = useState(null)

  const closeIcon = (props) => {
    return <Icon {...props} name="close-outline" style={{ width: 32, height: 32, color: 'white' }}></Icon>
  }


  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    setConnection(connection)


    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {

    // const user = new Keypair();

    // console.log('user', user)
    // console.log('user.publicKey', user.publicKey);
    console.log('publicKey', publicKey)
    // console.log('user.secretKey', user.secretKey);

    console.log(data)
    console.log("yo, type, data", type, parseURL(data))
    setOpenCamera(false);

    let parsedData = parseURL(data)

    const res = await fetch(parsedData.link);
    const json = await res.json();

    console.log('json', json.label)

    const res2 = await fetch(parsedData.link, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: publicKey,
      })
    });


    const json2 = await res2.json();
    console.log('json2', json2)

    console.log('json2.transaction', json2.transaction)

    const buffer = Buffer.from(json2.transaction, 'base64');

    const tx = Transaction.from(buffer)

    console.log('tx', tx)
    console.log('tx', tx.instructions)
    console.log('tx', tx.instructions.length)
    console.log('secretkey', secretKey, secretKey.length)
    const kp = Keypair.fromSecretKey(secretKey)

    console.log('kp', kp)

    const user_token_addr = await getAssociatedTokenAddress(USDC_MINT_ADDR, publicKey)
    const user_balance = await connection.getTokenAccountBalance(user_token_addr)
    console.log('user_addr', user_token_addr, "user_balance", user_balance)
    const user_balance_ui = user_balance.value.uiAmount
    const decimals = user_balance.value.decimals
    console.log('decimals', typeof decimals)

    let simulatedAmount

    const simulation = await connection.simulateTransaction(tx, [kp], true)
    
    console.log('simulation', simulation.value.accounts)
    console.log('simulation', simulation)

    simulation.value.accounts.forEach(account => {
      console.log('account', account)
      console.log('account data', account.data)
      const buffer = Buffer.from(account.data[0], "base64");
      if(buffer.length > 0){
        console.log('buffer', buffer)
        // console.log('buffer', JSON.parse(buffer))
        const mint_pubkey = buffer.subarray(0, 32)
        const owner_pubkey = buffer.subarray(32, 64)
        console.log('mint_pubkey', (new PublicKey(mint_pubkey)).toBase58())

        if((new PublicKey(mint_pubkey)).toBase58() === USDC_MINT_ADDR.toBase58() && (new PublicKey(owner_pubkey)).toBase58() === publicKey.toBase58()){
          const amount_arr = buffer.subarray(64, 72)
          const actual_amount = new BN(amount_arr, 10, 'le')
          console.log('actual_amount', actual_amount.div(new BN(Math.pow(10, decimals))).toString())
          simulatedAmount = actual_amount.div(new BN(Math.pow(10, decimals))).toString()
          
          console.log('amount_arr', amount_arr)
          // console.log("amount_arr", buffer.readUint32BE(64))
          // console.log("length", buffer.length)
        }
        // const rawAcc = AccountLayout.decode(buffer)
        // console.log('rawAcc', rawAcc)
  
      }
      // console.log("BANANA", JSON.parse(atob(account.data[0])))
      
    })

    const token_difference = user_balance_ui - parseInt(simulatedAmount)
    console.log('token_difference', token_difference)
    setSimulatedTokenDiff(token_difference)
    setModalVisible(true)
    setUnconfirmedTx(tx)

    // const receipt = await connection.sendTransaction(tx)
    // let txid = await sendAndConfirmTransaction(
    //   connection,
    //   tx,
    //   [kp],
    //   {
    //     skipPreflight: true,
    //     preflightCommitment: "confirmed",
    //     confirmation: "confirmed",
    //   }
    // );

    // console.log('txid', txid)

    // let transaction = await connection.getTransaction(txid)

    // console.log('transaction details', JSON.stringify(transaction))





  }

  const handleTx = async () => {

    const kp = Keypair.fromSecretKey(secretKey)

    let txid = await sendAndConfirmTransaction(
      connection,
      unconfirmedTx,
      [kp],
      {
        skipPreflight: true,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
      }
    );

    setModalVisible(false)

  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  

  return (
    <View style={tw`h-11/12 w-full`}>
    <ImageBackground source={paradise} style={tw`h-full w-full`} resizeMode="fill">
    <View style={tw`flex-col h-full w-full justify-center items-center`} >
      {openCamera ? 
        (
          <View style={tw`flex-col w-full`}><BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={tw`h-full w-full bg-black z-0`}
          />
         </View>
        ) : (
          <View style={tw`h-7/12 flex-col justify-around items-center`}>
            <ScrollView style={tw`flex-col w-full p-4 h-full`} contentContainerStyle={{flexGrow: 1, alignItems:'center'}}>
              <View style={tw`flex-col items-center justify-around mb-3 h-8/12 w-full`}>
                  <Image
                  source={logo}
                  style={tw`h-5/12`}
                  resizeMode="contain"
                />
                <View style={tw`flex-row justify-around items-center`}>
                <Text category='h5'>Your CUBE Balance:</Text>
                <Text category='h4' style={tw`text-black`}> ${userBalance}</Text>
                </View>
              </View>
              <Button style={tw`w-4/24 h-4/24 bg-black border-0`} status='warning' onPress={() => setOpenCamera(true)}>Scan QR Code and Pay</Button>
              {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </ScrollView>
            <GestureRecognizer
              onSwipeDown={() => setModalVisible(!modalVisible)}
            >
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={tw`h-full w-full flex-col justify-end absolute`}>
                  
                    <View style={tw.style(`h-9/12 w-full self-center bg-white flex-col justify-around items-center`, { borderRadius: 40 })}>
                      <Text category="h3" style={tw`mt-10`}>Transaction details: </Text>
                      <View style={tw`transparent h-5/12 w-10/12 rounded-2xl flex-col justify-center items-center bg-amber-200`}>
                      <Text style={{fontSize: 20, margin:10, color:'black'}}>Simulated amount: -{simulatedTokenDiff} USDC</Text>
                      <Text style={{fontSize: 20, margin:10, color:'black'}}>NFTs received: None </Text>
                      <Text style={{fontSize: 20, margin:10, color:'black'}}>Estimated gas cost: {"<"} 0.00001$ </Text>
                      </View>
                      <Button style={tw`w-8/12 bg-black border-0`} status='warning' onPress={handleTx}>Approve Transaction</Button>
                      
 
                    </View>
                </View>
              </Modal>
            </GestureRecognizer>
          </View>
        )
      }
    </View>
    </ImageBackground>
    </View>
  )
}