import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"
import { ApplicationProvider, Layout, Text, Input, Button } from "@ui-kitten/components"
import tw from "twrnc"
import { Link, useNavigate, useLocation } from "react-router-native"
import * as web3 from "@solana/web3.js"
import { usePublicKey } from "../hooks/usePublicKey"
import {
  createAssociatedTokenAccount,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token"
import {
  Cluster,
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import { useEffect, useState } from "react"
import { TransactionList } from "./TransactionList"

export function Dashboard() {
  const { publicKey, userBalance } = usePublicKey(true)
  const connection = new Connection("https://api.devnet.solana.com", "confirmed")
  console.log("connection made")
  const USDC_MINT_ADDR = "6L61933r4BBMJwoejjCZeJtDWouTtgvVAokDiSqyt4DQ"
  const [transactions, setTransactions] = useState(null)

  // async function getTransactions(address) {
  //   console.log("getting transactions for adress; ", address)
  //   if (!address) return
  //   // await connection.requestAirdrop(publicKey, 2e9)
  //   const ata = await getAssociatedTokenAddress(new PublicKey(USDC_MINT_ADDR), publicKey)
  //   console.log("associated token address: ", ata)

  //   const confirmedSignatureInfos = await connection.getSignaturesForAddress(ata)
  //   const signatures = confirmedSignatureInfos.map(({ signature }) => signature)
  //   console.log(signatures)
  //   const txs = await connection.getTransactions(signatures)
  //   console.log("first full tx: ", txs[0])
  //   setTransactions(
  //     txs.map(({ blockTime, meta, transaction }) => {
  //       // Create a new JavaScript Date object based on the timestamp
  //       // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  //       const date = new Date(blockTime * 1000)

  //       const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" })
  //       const formattedTime = formatter.format(date)

  //       console.log(formattedTime)

  //       console.log("transaction.message.accountKeys: ", transaction.message.accountKeys)

  //       const keyIndex = transaction.message.accountKeys.findIndex(
  //         (element) => element.toBase58() === publicKey.toBase58()
  //       )

  //       console.log({ keyIndex, accountKeys: transaction.message.accountKeys })

  //       console.log("postBalances", meta.postBalances)
  //       console.log("prebalances", meta.preBalances)

  //       const postBalance = meta.postBalances[keyIndex]

  //       const preBalance = meta.preBalances[keyIndex]

  //       const amount = postBalance - preBalance

  //       console.log({ postBalance, preBalance, amount })

  //       return { date: formattedTime, amount }
  //     })
  //   )
  // }

  // useEffect(() => {
  //   getTransactions(publicKey)
  // }, [publicKey])

  const renderTransactions = () => {
    //   console.log('publicKey', publicKey);
    //   const addr = getAssociatedTokenAddress(connection, new PublicKey(USDC_MINT_ADDR))
  }
  console.log("first transaction: ", transactions?.[0])

  return (
    <View style={tw`flex-col h-11/12 w-full justify-center items-center bg-slate-100 pt-12`}>
      <View style={tw`flex-col w-full h-full p-4`}>
        <View style={tw`flex-col items-center justify-center mb-3`}>
          <Text category="h5">cubePAY Balance:</Text>
          <Text category="h2" style={tw`text-blue-600`}>
            ${userBalance}
          </Text>
          <Link to="/signup">
            <Text style={tw`underline`}>To signup</Text>
          </Link>
        </View>
        <View style={tw`flex-col items-center justify-start`}>
          <Text style={tw`self-start ml-3 mb-1`}>RECENT TRANSACTIONS</Text>
          <View style={tw`bg-white w-full rounded-2xl`}>
            <TransactionList />
          </View>
        </View>
      </View>
    </View>
  )
}
