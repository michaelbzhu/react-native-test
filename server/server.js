const express = require('express')
const http = require('http');
const cors = require("cors");
const { clusterApiUrl, Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
const { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const BigNumber = require('bignumber.js');
const { TEN } = require('@solana/pay');



require('dotenv').config();

const app = express()
const port = 8000
const server = http.createServer(app);
const connection = new Connection("http://127.0.0.1:8899", 'processed');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/', async (req, res) => {
  res.send({label: "CubeStore", icon: "https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/cube_icon_kjijxo.jpg"})
})

app.post('/', async (req, res) => {
  console.log('req.body', req)
  const accountField = req.body.account;
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  // create spl transfer instruction
  const splTransferIx = await createSplTransferIx(sender, connection);

  console.log('splTransferIx', splTransferIx)

  // create the transaction
  const transaction = new Transaction();

  // add the instruction to the transaction
  transaction.add(splTransferIx);

  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });

  console.log({serializedTransaction})

  const base64Transaction = serializedTransaction.toString('base64');
  console.log({base64Transaction})
  const message = 'Thank you for your purchase from cubestore';

  response.status(200).send({ transaction: base64Transaction, message });
})

async function createSplTransferIx(sender, connection) {
  const splToken = new PublicKey("JA75DvMhiKwjtCbCyZTV5vuZdJ5B8zS1KXL29KALksvf");
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
  let amount = 10;
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