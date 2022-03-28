import bip39 from 'bip39'

const mnemonic = bip39.generateMnemonic(256)
//Generates random mnemonic
//console.log(mnemonic)
//Overiting for conistatncy
const mnemonicSaved = "clip finish garbage off nice bicycle memory mouse shy multiply bonus busy client tattoo hamster gold slam lava orange pave arm grocery midnight name"
console.log(mnemonicSaved)

const b = bip39.mnemonicToSeedSync('basket')
//Taking a mnemonic phrase to a list of 64 numbers that stay consistantof the phrase you enter
console.log(b)

const mTOe = bip39.mnemonicToEntropy(mnemonicSaved)
//Takes mnemonic to entropy which is a private key
console.log(mTOe)

const eTOm = bip39.entropyToMnemonic(mTOe)
//Takes mnemonic to entropy which is a private key
console.log(eTOm)