import { PublicKey } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

export const usePublicKey = () => {
  const [publicKey, setPublicKey] = useState(null)
  const db = getFirestore()
  const auth = getAuth()
  const userUID = auth.currentUser?.uid

  async function getPublicKeyOfCurrentUser() {
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
      }
    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!")
    }
  }

  useEffect(() => {
    getPublicKeyOfCurrentUser()
  }, [])

  return publicKey
}
