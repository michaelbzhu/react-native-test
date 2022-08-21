import { getAuth } from "firebase/auth"
import { useNavigate } from "react-router-native"
import { View, Text, ActivityIndicator } from "react-native"
import tw from "twrnc"
import { useEffect } from "react"
import * as web3 from "@solana/web3.js"
import { getFirestore, collection, doc, setDoc } from "firebase/firestore"
import bs58 from "bs58"

export function GeneratingKey() {
  const navigate = useNavigate()
  const auth = getAuth()
  const user = auth.currentUser

  // useEffect(() => {
  //   async function generateAndStoreKeys() {
  //     if (user) {
  //       const uid = user.uid
  //       console.log({ uid })

  //       const { publicKey, secretKey } = web3.Keypair.generate()
  //       console.log({ publicKey: publicKey.toBase58(), secretKey: bs58.encode(secretKey) })
  //       const db = getFirestore()
  //       try {
  //         await setDoc(doc(collection(db, "wallets"), uid), {
  //           uid,
  //           publicKey: publicKey.toBase58(), // convert to base58 so it's a supported datatype in db
  //           secretKey: bs58.encode(secretKey),
  //         }).then(() => {
  //           setTimeout(() => navigate("home", { replace: true }), 1000)
  //         })
  //       } catch (e) {
  //         console.error("error adding doc: ", e)
  //       }
  //     } else {
  //       navigate("login")
  //     }
  //   }
  //   generateAndStoreKeys()
  // }, [])

  return (
    <View style={tw`flex-col items-center justify-center h-full w-full`}>
      <View style={tw`flex-col items-center justify-between h-4/12 w-9/12`}>
        <ActivityIndicator size="large" />
        <Text category="h2">Generating your Solana Wallet</Text>
      </View>
    </View>
  )
}
