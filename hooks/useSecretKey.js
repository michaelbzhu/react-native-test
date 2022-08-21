import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import bs58 from "bs58"

export const useSecretKey = () => {
  const [secretKey, setSecretKey] = useState(null)
  const db = getFirestore()
  const auth = getAuth()
  const userUID = auth.currentUser?.uid

  async function getSecretKeyOfCurrentUser() {
    if (!userUID) {
      console.error("Can't get user UID")
      return
    }
    console.log({ userUID })
    const docRef = doc(db, "wallets", userUID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      const userSecretKey = docSnap.data()?.secretKey
      if (userSecretKey) {
        setSecretKey(bs58.decode(userSecretKey))
      }
    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!")
    }
  }

  useEffect(() => {
    getSecretKeyOfCurrentUser()
  }, [])

  return secretKey
}
