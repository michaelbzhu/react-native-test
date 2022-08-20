import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { NativeRouter, Route, Link, Routes } from "react-router-native";
import { View } from 'react-native';

export default function App() {

  return (
    <NativeRouter>
      <Routes>
        <Route exact path="/" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </NativeRouter>
  );
}
