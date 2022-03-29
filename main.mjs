import bip39 from 'bip39'
import bitcoinjs from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const mnemonic = bip39.generateMnemonic(256)
//Generates random mnemonic
//console.log(mnemonic)
//Overiting for conistatncy
const mnemonicSaved = "clip finish garbage off nice bicycle memory mouse shy multiply bonus busy client tattoo hamster gold slam lava orange pave arm grocery midnight name"
console.log(mnemonicSaved)//Prints Mnemon

const b = bip39.mnemonicToSeedSync('basket')
//Taking a mnemonic phrase to a list of 64 numbers that stay consistantof the phrase you enter
//console.log(b)

const mTOe = bip39.mnemonicToEntropy(mnemonicSaved)
//Takes mnemonic to entropy which will be used to make the private key
console.log(mTOe)//Prints String

const eTOm = bip39.entropyToMnemonic(mTOe)
//Goes other way
console.log(eTOm)//Prints Mnemon

//Generating a TestNet Key Pair
//const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoinjs.networks.testnet;

const ECPair = ECPairFactory(ecc);

const keyPair = ECPair.fromWIF(
    '2b4ae17e4ca9562be2bc85c7922c658f92adbc9a2b22cb0fba6f50c0bacda31c',
  );
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });