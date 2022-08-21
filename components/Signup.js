import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import tw from "twrnc"
import { Link, useNavigate } from "react-router-native"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { createAssociatedTokenAccount } from '@solana/spl-token';
import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';


export function Signup({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const connection = new Connection("https://api.devnet.solana.com", 'processed');
  const SERVER_URL = "https://hip-hands-arrive-12-202-1-227.loca.lt"

  const auth = getAuth()
  const navigate = useNavigate()

  const notValidEmail = (maybeValidEmail) => maybeValidEmail === ""
  const notValidPassword = (maybeValidPassword) => maybeValidPassword === ""

  const handleSignUp = () => {
    if (notValidEmail(email)) {
      Alert.alert("Invalid Email")
      return
    }
    if (notValidPassword(password)) {
      Alert.alert("Invalid Password")
      return
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const uid = userCredential.user.uid
        console.log({ uid })

        navigate("/generate", { replace: true })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log({ errorCode, errorMessage })
      })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-col items-center justify-center h-full w-full`}>
        <View style={tw`flex-col items-center justify-between h-4/12 w-9/12`}>
          <Text category="h2">Join CUBEPay</Text>
          <View style={tw`flex-col items-center justify-around w-full h-6/12`}>
            <Input
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={(nextValue) => setEmail(nextValue)}
            ></Input>
            <Input
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={(nextValue) => setPassword(nextValue)}
            ></Input>
          </View>
          <StatusBar style="auto" />
          <Button status="primary" style={tw`w-1/2`} onPress={handleSignUp}>
            Sign Up
          </Button>
          <View style={tw`flex-row`}>
            <Text category="s1">Already a Roamer? </Text>
            <Link to="login">
              <Text style={tw`underline`}>Log In</Text>
            </Link>
          </View>
        </View>
        <Link to="/home"><Text style={tw`underline`} >To Home</Text></Link>
        <Link to="/merchanthome"><Text style={tw`underline`} >To Merchant Home</Text></Link>
      </View>
    </TouchableWithoutFeedback>
  )
}
