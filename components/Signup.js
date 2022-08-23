import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert, Image } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import tw from "twrnc"
import { Link, useNavigate } from "react-router-native"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { createAssociatedTokenAccount } from "@solana/spl-token"
import {
  Cluster,
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import logo from "../assets/logo.png"

export function Signup({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const connection = new Connection("https://api.devnet.solana.com", "processed")
  // const SERVER_URL = "https://hip-hands-arrive-12-202-1-227.loca.lt"

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
      <View style={tw`flex-col items-center justify-start h-full w-full mt-30`}>
        <View style={tw`flex-col items-center justify-start h-7/12 w-9/12`}>
          <Image source={logo} style={tw`h-4/12`} resizeMode="contain" />
          <Text category="h2">Join CUBE.</Text>
          <View style={tw`flex-col items-center justify-around w-full h-4/12`}>
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
          <Button status="primary" style={tw`w-1/2 bg-black border-0 mt-7`} onPress={handleSignUp}>
            Sign Up
          </Button>
          <View style={tw`flex-row mt-1`}>
            <Text category="s1">Already a CUBER? </Text>
            <Link to="/login">
              <Text style={tw`underline`}>Log In</Text>
            </Link>
          </View>
        </View>
        <Link to="/home">
          <Text style={tw`underline`}>To User Home</Text>
        </Link>
        <Link to="/merchanthome">
          <Text style={tw`underline`}>To Merchant Home</Text>
        </Link>
      </View>
    </TouchableWithoutFeedback>
  )
}
