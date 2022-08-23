import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert, Image } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import tw from "twrnc"
import { Link, useNavigate } from "react-router-native"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import logo from "../assets/logo.png"

export function Login({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const notValidEmail = (maybeValidEmail) => maybeValidEmail === ""
  const notValidPassword = (maybeValidPassword) => maybeValidPassword === ""

  const auth = getAuth()

  const handleLogIn = () => {
    if (notValidEmail(email)) {
      Alert.alert("Invalid Email")
      return
    }
    if (notValidPassword(password)) {
      Alert.alert("Invalid Password")
      return
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log({ userCredential, user })
        Alert.alert(`logged in as ${user.email} with uid: ${user.uid}`)
        navigate("/home", { replace: true })
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
          <Text category="h2">Enter CUBE.</Text>
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
          <Button status="primary" style={tw`w-1/2 bg-black border-0 mt-7`} onPress={handleLogIn}>
            Log In
          </Button>
          <View style={tw`flex-row mt-1`}>
            <Text category="s1">Don't have an account? </Text>
            <Link to="/">
              <Text style={tw`underline`}>Sign Up</Text>
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
