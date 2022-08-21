import { Signup } from "./components/Signup"
import { Login } from "./components/Login"
import { Home } from "./components/Home"
import { NativeRouter, Route, Link, Routes } from "react-router-native"
import { View } from "react-native"
import "react-native-get-random-values"
import "react-native-url-polyfill/auto"
import * as eva from "@eva-design/eva"
import { EvaIconsPack } from "@ui-kitten/eva-icons"
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components"
import { Pay } from "./components/Pay"
import { Deposit } from "./components/Deposit"
import { MerchantHome } from "./components/MerchantHome"
import { initializeApp } from "firebase/app"
import { GeneratingKey } from "./components/GeneratingKey"

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
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NativeRouter>
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/merchanthome" element={<MerchantHome />} />
            <Route exact path="/" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/generate" element={<GeneratingKey />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/deposit" element={<Deposit />} />
          </Routes>
        </NativeRouter>
      </ApplicationProvider>
    </>
  )
}
