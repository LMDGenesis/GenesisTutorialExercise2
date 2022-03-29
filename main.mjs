import bip39 from 'bip39'
import bitcoinjs from 'bitcoinjs-lib'
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

const bip32 = BIP32Factory(ecc);

const mnemonic = bip39.generateMnemonic(256)
const path = "m/44'/1'/0'/0/0";


//Generates random mnemonic
//console.log(mnemonic)
//Overiting for conistatncy
const mnemonicSaved = "clip finish garbage off nice bicycle memory mouse shy multiply bonus busy client tattoo hamster gold slam lava orange pave arm grocery midnight name"
console.log(mnemonicSaved)//Prints Mnemon

const seed = bip39.mnemonicToSeedSync(mnemonicSaved)
//Taking a mnemonic phrase to a list of 64 numbers that stay consistantof the phrase you enter
console.log(seed)

//Get the seed from mnemonic already made
//Use bip32 to derive children from taht key with the path

//Get the bip32 root from seed
const root = bip32.fromSeed(seed);
//Get the keyPair from the root
const keyPair = root.derivePath(path);
console.log("KeyPair: ", keyPair)

const { address } = bitcoinjs.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: bitcoinjs.networks.testnet
});

console.log("Address:", address)
console.log("Private Key: ", Buffer.from(keyPair.privateKey).toString('hex'))
console.log("Public Key: ", Buffer.from(keyPair.publicKey).toString('hex'));

axios
  .get('https://blockstream.info/testnet/api//address/'+address)
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
  })
  .catch(error => {
    console.error(error)
  })