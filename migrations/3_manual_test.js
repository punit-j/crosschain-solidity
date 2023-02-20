const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { ethers } = require("ethers");
const { randomBytes } = require('ethers/utils');
require("dotenv").config();
const Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction

let web3 = new Web3("wss://mainnet.infura.io/ws/v3/f36c86581bc34486bca0a45a487b10a8")

const AmTokenHandler = artifacts.require("AmTokenHandler");
const ERC20Handler = artifacts.require("ERC20Handler");
const ExampleToken = artifacts.require("ExampleToken");
const AaveHandler = artifacts.require("AaveHandler");
const Bridge = artifacts.require("Bridge");

let chainID = "0x0000000000000001";
let lachainChainID = "0x00000000574c4131";
let laRecourceID = "0x5d9633ae98cc9ce999df86a069470e931d590bc7f34d0abca36bfeb5f0d9113a"; //cannot be random (to map to other chains)
let usdtRecourceID = "0x000000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let aaveusdtRecourceID = "0xA00000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let amTokenResourceID = "0xAA0000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let nativeRecourceID = "0x00000000000000c4f76f223a578FF90Cc9472D0C3E67679Ef7c824f2d81B4C0F"; //cannot be random (to map to other chains)
let depositFee = 20;
let amount = "3000000000000000000"; // 3 eth
let backendSrvAddress = "0xd205d505aD413e627523FB877380e4A9de2c786a";

module.exports = async function (deployer, network, accounts) {
  let recipient = `${accounts[0]}`
  // let bridge = await Bridge.at("0xc7fc91a0a93d570738b2af6efb1595c3183809d7");
  // let handler = await ERC20Handler.at("0x26B11bd5347cf5f700464ae81d49fc11F08AEE51");
  // let usdt = await ExampleToken.at("0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee")

  // let decimals = await usdt.decimals()
  // console.log(decimals.toString(), " decimals in BSC contract")
  // await usdt.approve(handler.address, amount);
  // console.log("approval done")

  // let balance = await usdt.balanceOf(accounts[0])
  // console.log(balance.toString(), " account balance")
  // console.log(await bridge.deposit(lachainChainID, usdtRecourceID, amount, recipient, 0, {value: 20}));  //relayers will vote after this
  // console.log("deposit done")
  const privateKey1Buffer = Buffer.from(process.env.POLYGON_KEY, 'hex')
  let x = {from: "0x596bC98630E2548379b7C997e69c5e09eC4E0a7D", to: "0x596bC98630E2548379b7C997e69c5e09eC4E0a7D", nonce: 2036, value: 1}
  let sTx = new Tx(x)
  sTx.sign(privateKey1Buffer)
  let serTx = '0x' + sTx.serialize().toString('hex')
  console.log(await web3.eth.sendSignedTransaction(serTx))
  // console.log(await web3.eth.sendTransaction(x))
  // console.log(await bridge.executeProposal("0x00000000000000e1", "0x0000000000000001", 74, "0x00000000000000c4f76f223a578ff90cc9472d0c3e67679ef7c824f2d81b4c0f", "0x01b352E29388D1A95054464F478F31D1A6C51325", "15645833817435055", "0x00", {nonce: 125}))
}