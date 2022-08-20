import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Pay } from './components/Pay';
import { Deposit } from './components/Deposit';
import { NativeRouter, Route, Link, Routes } from "react-router-native";
import { View } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import * as eva from '@eva-design/eva';

export default function App() {

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NativeRouter>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/pay" element={<Pay/>} />
          <Route path="/deposit" element={<Deposit/>} />
        </Routes>
      </NativeRouter>
    </ApplicationProvider>
  );
}
