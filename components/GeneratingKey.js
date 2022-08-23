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
  const SERVER_URL = "https://calm-pots-cheer-12-202-1-227.loca.lt"

  useEffect(() => {
    async function generateAndStoreKeys() {
      if (user) {
        const uid = user.uid
        console.log({ uid })

        // const { publicKey, secretKey } = web3.Keypair.generate()

        const res = await fetch(SERVER_URL + "/generateAccounts", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid,
          })
        }).then(() => {
          navigate("/home", { replace: true })
        })

      } else {
        navigate("/login")
      }
    }
    generateAndStoreKeys()
  }, [])

  return (
    <View style={tw`flex-col items-center justify-center h-full w-full`}>
      <View style={tw`flex-col items-center justify-between h-4/12 w-9/12`}>
        <ActivityIndicator size="large" />
        <Text category="h2">Generating your Solana Wallet</Text>
      </View>
    </View>
  )
}
