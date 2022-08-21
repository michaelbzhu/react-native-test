const express = require('express')
const http = require('http');
const cors = require("cors");
const { clusterApiUrl, Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
const { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint, createAssociatedTokenAccount, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const BigNumber = require('bignumber.js');
const { TEN } = require('@solana/pay');
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore")




require('dotenv').config();

const app = express()
const port = 8000
const server = http.createServer(app);
const connection = new Connection("http://127.0.0.1:8899", 'processed');
const USDC_MINT_ADDR = "6L61933r4BBMJwoejjCZeJtDWouTtgvVAokDiSqyt4DQ"
const SECRET_KEY = process.env.KEYPAIR.split(",").map(x => parseInt(x))
const firebaseConfig = {
  apiKey: "AIzaSyBYtvszJhYMn_7UwhIzQ_7lH4gzNQHD8-8",
  authDomain: "floodgate-squad.firebaseapp.com",
  projectId: "floodgate-squad",
  storageBucket: "floodgate-squad.appspot.com",
  messagingSenderId: "495661629168",
  appId: "1:495661629168:web:b642b61f5394be9a4c8c35",
}

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig)


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('*', async (req, res) => {
  console.log('GET REQUEST')
  res.send({label: "CubeStore", icon: "https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/cube_icon_kjijxo.jpg"})
})

app.post('/generateAccounts', async (req,res) => {
  console.log('Here req.body', req.body.uid)
  // const uint8 = new Uint8Array(SECRET_KEY);
  // console.log('here')

  const uid = req.body.uid;
  const user = new Keypair();
  const companyKP = new Keypair();
  const airdrop_sig = await connection.requestAirdrop(companyKP.publicKey, 2e9);
  const latestBlockHash = await connection.getLatestBlockhash();
  const tx = await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdrop_sig,
  });

  console.log('here', tx)

  const address = await createAssociatedTokenAccount(connection, companyKP, new PublicKey(USDC_MINT_ADDR), user.publicKey)

  const db = getFirestore(fireBaseApp)
  try {
    await setDoc(doc(collection(db, "wallets"), uid), {
      uid,
      publicKey: user.publicKey.toBase58(), // convert to base58 so it's a supported datatype in db
      secretKey: bs58.encode(user.secretKey),
    })
  } catch (e) {
    console.error("error adding doc: ", e)
  }

  res.status(200).send({ address });

})

app.post('/', async (req, res) => {
  console.log('req.body', req.body)
  const accountField = req.body.account;
  console.log('accountfield wtf', accountField, typeof accountField)
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  // create spl transfer instruction
  const splTransferIx = await createSplTransferIx(sender, connection);


  const blockhash_obj = await connection.getLatestBlockhash();

  // console.log('blockhash', blockhash)

  // create the transaction
  const transaction = new Transaction({ blockhash: blockhash_obj.blockhash, feePayer: sender, lastValidBlockHeight: blockhash_obj.lastValidBlockHeight });

  // add the instruction to the transaction
  transaction.add(splTransferIx);

  console.log('transaction', transaction)

  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });

  console.log({serializedTransaction})

  const base64Transaction = serializedTransaction.toString('base64');
  console.log({base64Transaction})
  const message = 'Thank you for your purchase from cubestore';

  res.status(200).send({ transaction: base64Transaction, message });
})

async function createSplTransferIx(sender, connection) {
  const splToken = new PublicKey("6L61933r4BBMJwoejjCZeJtDWouTtgvVAokDiSqyt4DQ");
  const MERCHANT_WALLET = new PublicKey("7LHoz2dzSjqWQFPWjjTDwya1svzywW4nQvmghcNmoxUy");
  const senderInfo = await connection.getAccountInfo(sender);
  if (!senderInfo) throw new Error('sender not found');

  // Get the sender's ATA and check that the account exists and can send tokens
  console.log('sender', sender)
  console.log('splToken', splToken)

  const senderATA = await getAssociatedTokenAddress(splToken, sender);

  console.log('yoo senderATA', senderATA)
  const senderAccount = await getAccount(connection, senderATA);
  console.log('yoo')
  if (!senderAccount.isInitialized) throw new Error('sender not initialized');
  console.log('yoo')
  if (senderAccount.isFrozen) throw new Error('sender frozen');
  console.log('yoo')

  // Get the merchant's ATA and check that the account exists and can receive tokens
  const merchantATA = await getAssociatedTokenAddress(splToken, MERCHANT_WALLET);
  console.log('yoo')
  const merchantAccount = await getAccount(connection, merchantATA);
  console.log('yoo')
  if (!merchantAccount.isInitialized) throw new Error('merchant not initialized');
  console.log('yoo')
  if (merchantAccount.isFrozen) throw new Error('merchant frozen');
  console.log('yoo')

  // Check that the token provided is an initialized mint
  const mint = await getMint(connection, splToken);
  if (!mint.isInitialized) throw new Error('mint not initialized');

  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  // Hard code to be 10 for now
  let amount = new BigNumber(10);
  amount = amount.times(TEN.pow(mint.decimals)).integerValue(BigNumber.ROUND_FLOOR);

  // Check that the sender has enough tokens
  const tokens = BigInt(String(amount));
  if (tokens > senderAccount.amount) throw new Error('insufficient funds');

  // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
  const splTransferIx = createTransferCheckedInstruction(
      senderATA,
      splToken,
      merchantATA,
      sender,
      tokens,
      mint.decimals
  );

  // Create a reference that is unique to each checkout session
  const references = [new Keypair().publicKey];

  // add references to the instruction
  for (const pubkey of references) {
      splTransferIx.keys.push({ pubkey, isWritable: false, isSigner: false });
  }

  return splTransferIx;
}


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})