import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { Connection, PublicKey } from "@solana/web3.js"

export const usePublicKey = (useTestKey = false) => {
  const [publicKey, setPublicKey] = useState(null)
  const USDC_MINT_ADDR = "6L61933r4BBMJwoejjCZeJtDWouTtgvVAokDiSqyt4DQ"
  const connection = new Connection("https://api.devnet.solana.com", "processed")
  const [userBalance, setUserBalance] = useState(null)

  const db = getFirestore()
  const auth = getAuth()
  const userUID = auth.currentUser?.uid

  async function getPublicKeyOfCurrentUser() {
    if (useTestKey) {
      setPublicKey(new PublicKey("9sgcecPQ1dNvfHZwiAhEuZKw8AJVyvab5AthHt3vBAuw"))
      getTokenBalance(new PublicKey("9sgcecPQ1dNvfHZwiAhEuZKw8AJVyvab5AthHt3vBAuw"))
      return
    }
    if (!userUID) {
      console.error("Can't get user UID")
      return
    }
    console.log({ userUID })
    const docRef = doc(db, "wallets", userUID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      const userPublicKey = docSnap.data()?.publicKey
      if (usePublicKey) {
        setPublicKey(new PublicKey(userPublicKey))
        getTokenBalance(new PublicKey(userPublicKey))
      }
    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!")
    }
  }

  const getTokenBalance = async (pk) => {
    if (pk) {
      console.log("publicKey", pk)
      const addr = await getAssociatedTokenAddress(new PublicKey(USDC_MINT_ADDR), pk)
      const balance = await connection.getTokenAccountBalance(addr)

      console.log("addr", addr, "balance", balance.value.uiAmount)
      setUserBalance(balance.value.uiAmount)
    }
  }

  useEffect(() => {
    getPublicKeyOfCurrentUser()
  }, [])

  return { publicKey, userBalance }
}
