import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import tw from "twrnc"
import { Link } from "react-router-native"

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

export function Signup({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const auth = getAuth()

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
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log({ userCredential, user })
        Alert.alert(`logged in as ${user.email} with uid: ${user.uid}`)
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
      </View>
    </TouchableWithoutFeedback>
  )
}
