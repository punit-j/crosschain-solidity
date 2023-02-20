const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { ethers } = require("ethers");
const { randomBytes } = require('ethers/utils');
const Web3 = require("web3");

let web3 = new Web3(Web3.givenProvider || "HTTP://172.27.208.1:7545")

const AmTokenHandler = artifacts.require("AmTokenHandler");
const ERC20Handler = artifacts.require("ERC20Handler");
const ExampleToken = artifacts.require("ExampleToken");
const AaveHandler = artifacts.require("AaveHandler");
const Bridge = artifacts.require("Bridge");

let chainID = "0x0000000000000001";
let laRecourceID = "0x5d9633ae98cc9ce999df86a069470e931d590bc7f34d0abca36bfeb5f0d9113a"; //cannot be random (to map to other chains)
let usdtRecourceID = "0x000000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let aaveusdtRecourceID = "0xA00000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let amTokenResourceID = "0xAA0000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"; //cannot be random (to map to other chains)
let nativeRecourceID = "0x00000000000000c4f76f223a578FF90Cc9472D0C3E67679Ef7c824f2d81B4C0F"; //cannot be random (to map to other chains)
let depositFee = 20;
let backendSrvAddress = "0xd205d505aD413e627523FB877380e4A9de2c786a";

module.exports = async function (deployer, network, accounts) {
  // let bridge = await Bridge.deployed()
  // console.log(bridge.address)
  let bridge = await Bridge.at("0xE372D290F83c7487bdc925ddA187671bfF9e347b");
  let handler = await ERC20Handler.at("0x82E4d5d7F36a22f2FEaaF87eCcDcDA7e0EFc98C3");
  // let aavehandler = await ERC20Handler.at("0x45b78bF1F49d1249C8B7174612aee6aaf46e70F1");
  // let bridge = await upgradeProxy("0xE372D290F83c7487bdc925ddA187671bfF9e347b", Bridge, {deployer})

  // await deployer.deploy(AaveHandler, bridge.address)
  // let aaveHandler = await AaveHandler.deployed()
  // console.log(aaveHandler.address)
  let aaveHandler = await AaveHandler.at("0x8a7c3fF8F6D71A8BF26505A4ed41aFcC8ec698A6");

  // await deployer.deploy(AmTokenHandler, bridge.address)
  // let amHandler = await AmTokenHandler.deployed()
  // console.log(amHandler.address)
  let amHandler = await AmTokenHandler.at("0x04C7A790248c255e28d514C608f2cA8Efc108652");
  let usdt = await ExampleToken.at("0xc2132d05d31c914a87c6611c10748aeb04b58e8f")
  let amUSDT = await ExampleToken.at("0x60D55F02A771d515e077c9C2403a1ef324885CeC")

  // console.log(await bridge.setHandler(aaveHandler.address, true)); //map resourceID to token and handler of that token
  // console.log(await bridge.setHandler(amHandler.address, true)); //map resourceID to token and handler of that token
  // console.log(await bridge.setResource(aaveHandler.address, aaveusdtRecourceID, usdt.address)); //map resourceID to token and handler of that token
  // console.log(await bridge.setResource(amHandler.address, amTokenResourceID, amUSDT.address)); //map resourceID to token and handler of that token
  // console.log(await bridge.approveSpending(usdtRecourceID, aaveusdtRecourceID, "10000000000000000000")); //map resourceID to token and handler of that token

  // console.log(await amHandler.setAaveHandler(aaveHandler.address))
  // console.log(await amHandler.setErc20Handler(handler.address))
  // console.log(await amHandler.setAmTokenResources(amTokenResourceID, aaveusdtRecourceID))


  console.log(await aaveHandler.setErc20Handler(handler.address))
  console.log(await aaveHandler.setAmTokenHandler(amHandler.address))
  console.log(await aaveHandler.setAaveTokenResources(aaveusdtRecourceID, amTokenResourceID))



  // var bytes = new Uint8Array(1024);
  // console.log(await bridge.executeProposal("0x00000000574c4131", "0x00000000004c4131", 10000,  amusdtRecourceID, "0x6Bc32575ACb8754886dC283c2c8ac54B1Bd93195", 10, bytes)); //map resourceID to token and handler of that token
  // console.log(await bridge._nativeResourceID())

  // console.log(await bridge.adminChangeFee(20));
  // console.log(await erc20.mint("0x0e3aC56774E282F7fF4F544ef996F1cf4331C3c5", "100000000000000000"))
  // await bridge.adminSetResource(handler.address, tokenResourceID, erc20.address); //map resourceID to token and handler of that token
  // let minterRole = await erc20.MINTER_ROLE();
  // await erc20.grantRole(minterRole, handler.address); //provide minter role to handler
  // await bridge.adminSetBurnable(handler.address, erc20.address)
    // console.log(await handler._resourceIDToTokenContractAddress("0x000000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"))
    // console.log(await handler._tokenContractAddressToResourceID("0xB37E0Fdf7CE53fEa4d1F463212e0bE454787488E"))
    // console.log(await handler._burnList("0xB37E0Fdf7CE53fEa4d1F463212e0bE454787488E"))
    // console.log(await bridge._resourceIDToHandlerAddress("0x000000000000001903eb5D26Aa73D863E9B53B880c9Aeff27A1d40d334095f77"))
  // console.log(await bridge.executeProposal(destChainID, chainID, 2, tokenResourceID, "0x1B84F69C40689C85F77c99E6111eA65489593726",10, {from:backendSrvAddress}))
  // console.log(await web3.eth.getBalance("0x1B84F69C40689C85F77c99E6111eA65489593726"))

  // console.log( await erc20.mint("0x7aeb781432E484d0663aE7f2e825B2b54CCd66EC", 100000000));
  //  console.log(await erc20.balanceOf("0xAa0164CE0f0F6E00e20e95E1375329C4a6F85690"));
  // await erc20.approve(handler.address, amount, {from:accounts[0]}); //approve handler to burn or transfer tokens
  // console.log(await erc20.decimals()); //approve handler to burn or transfer tokens
  // for(var i = 0; i<100; i++){
  // console.log(await bridge.deposit(destChainID, tokenResourceID, amount, accounts[0], { from: accounts[0], value: (depositFee+1) }))
  // }
  // console.log(await bridge.transferOwnership("0xd205d505aD413e627523FB877380e4A9de2c786a"))
  // console.log(await bridge.deposit(destChainID, tokenResourceID, amount - 10, recipient, 10, {from:accounts[0], value: 10}));  //relayers will vote after this
  // console.log(await erc20.balanceOf(recipient));
  // console.log(await bridge.executeProposal("0x0000000000000019", "0x0000000000000038", 2, "000000000000001903eb5d26aa73d863e9b53b880c9aeff27a1d40d334095f77", "0x01b352E29388D1A95054464F478F31D1A6C51325", ))
}