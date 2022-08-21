import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Pay } from './components/Pay';
import { Deposit } from './components/Deposit';
import { MerchantHome } from './components/MerchantHome';
import { NativeRouter, Route, Link, Routes } from "react-router-native";
import { View } from 'react-native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


export default function App() {

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NativeRouter>
          <Routes>
            <Route exact path="/home" element={<Home/>} />
            <Route exact path="/" element={<MerchantHome/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/pay" element={<Pay/>} />
            <Route path="/deposit" element={<Deposit/>} />

          </Routes>
        </NativeRouter>
      </ApplicationProvider>
    </>
  );
}
