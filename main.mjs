import bip39 from 'bip39'
import bitcoinjs from 'bitcoinjs-lib'
import { BIP32Factory } from 'bip32';
import { RegtestUtils } from 'regtest-client';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import axios from 'axios';

const APIPASS = process.env.APIPASS || 'satoshi';
const APIURL = process.env.APIURL || 'https://regtest.bitbank.cc/1';
const regtestUtils = new RegtestUtils({ APIPASS, APIURL });

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const regtest = regtestUtils.network;
const mnemonic = bip39.generateMnemonic(256)
const path = "m/44'/1'/0'/0/0";

const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature)

//Generates random mnemonic
//console.log(mnemonic)
//Overiting for conistatncy
const mnemonicSaved = "clip finish garbage off nice bicycle memory mouse shy multiply bonus busy client tattoo hamster gold slam lava orange pave arm grocery midnight name"
//console.log(mnemonicSaved)//Prints Mnemon

const seed = bip39.mnemonicToSeedSync(mnemonicSaved)
//Taking a mnemonic phrase to a list of 64 numbers that stay consistantof the phrase you enter
//console.log(seed)

//Get the seed from mnemonic already made
//Use bip32 to derive children from taht key with the path

//Get the bip32 root from seed
const root = bip32.fromSeed(seed);
//Get the keyPair from the root
const keyPair = root.derivePath(path);
//console.log("KeyPair: ", keyPair)

const { address } = bitcoinjs.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: bitcoinjs.networks.testnet,
});

console.log("Address:", address)
//console.log("Private Key: ", Buffer.from(keyPair.privateKey).toString('hex'))
//console.log("Public Key: ", Buffer.from(keyPair.publicKey).toString('hex'));

const getTransactionsFromAddress = async (address) => {
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api//address/' + address + "/txs");
        //console.log(resp.data[0]);
        return resp.data;

    } catch (e) {
        console.log(e)
    }
}

const getFullTransactionHashFromTransactionId = async (transactionId) => {
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api//tx/' + transactionId + '/hex');
        //console.log(resp.data[0]);
        return resp.data;

    } catch (e) {
        console.log(e)
    }
}

const getUTXOFromAddress = async (address) => {
    try {
        const resp = await axios.get('https://blockstream.info/testnet/api/address/' + address + '/utxo');
        //console.log(resp.data[0]);
        return resp.data[0];

    } catch (e) {
        console.log(e)
    }
}

const broadcastToTestnet = async(transaction) => {
    try {
            await axios({
                method: 'post',
                url: 'https://blockstream.info/testnet/api/tx',
                data: transaction
            });

    } catch (e) {
        console.log(e)
    }
}

const transactions = await getTransactionsFromAddress(address);
const utxo = await getUTXOFromAddress(address);
//console.log("utxo",utxo);
const transactionHash = await getFullTransactionHashFromTransactionId(utxo.txid)

console.log(transactions)
const psbt = new bitcoinjs.Psbt({network: bitcoinjs.networks.testnet});
// psbt.setVersion(2); // These are defaults. This line is not needed.
// psbt.setLocktime(0); // These are defaults. This line is not needed.

//Create Transaction
const input = {hash: utxo.txid, index: utxo.vout, nonWitnessUtxo: Buffer.from(transactionHash,"hex")}

const totalBalance = 

//Transaction Input
psbt.addInput(input);

//Transaction Output
psbt.addOutput({
    address: "mzNgRfPMCip8XpgB6NZ8XyJa2sqTxfintF",
    value: 5000,
});


psbt.addOutput({
    address: address,
    value: 5000,
});

psbt.signInput(0, ECPair.fromPrivateKey(keyPair.privateKey));
psbt.validateSignaturesOfInput(0, validator);

psbt.finalizeAllInputs();

//console.log(psbt.extractTransaction().toHex());
//await broadcastToTestnet(psbt.extractTransaction().toHex());