import { Signup } from "./components/Signup"
import { Login } from "./components/Login"
import { Home } from "./components/Home"
import { NativeRouter, Route, Link, Routes } from "react-router-native"
import { View } from "react-native"
import { ApplicationProvider } from "@ui-kitten/components"
import "react-native-get-random-values"
import "react-native-url-polyfill/auto"
import * as eva from "@eva-design/eva"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYtvszJhYMn_7UwhIzQ_7lH4gzNQHD8-8",
  authDomain: "floodgate-squad.firebaseapp.com",
  projectId: "floodgate-squad",
  storageBucket: "floodgate-squad.appspot.com",
  messagingSenderId: "495661629168",
  appId: "1:495661629168:web:b642b61f5394be9a4c8c35",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NativeRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </NativeRouter>
    </ApplicationProvider>
  )
}
