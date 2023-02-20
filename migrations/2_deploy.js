const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const Bridge = artifacts.require("Bridge");
const ERC20Handler = artifacts.require("ERC20Handler");
const ExampleToken = artifacts.require("ExampleToken");
require('dotenv').config()

let bnbChainId = "0x0000000000000061";
let bnbMainChainId = "0x0000000000000038";
let bnbToken = "0x8E350BfFB22104436c63F2Aa89482a99c1770640";
bnbResourceId =
  "0x00000000000000000000000000000000000000000c4f76f223a578ff90cc472d";

let ethChainId = "0x0000000000000004";
let ethToken = "0x1De054e70DE4a66F66708a88D7234fEa78Cced78";
let ethNativeResourceID =
  "0x00000000000000000000000000000000000000000c67679Ef7c824f2d81B4C0F";

let maticToken = "0x544371Edb9ACE8E6F6Caf47FeDd25dF37605102E";
let maticResourceID =
  "0x0000000000000000000000000000000000000000e778420cc87BFaBAb72bB02F";
let maticChainID = "0x0000000000000089";
let mumbaiChainID = "0x00000000004c4131";

// Mainnet
// let depositFee = 0;
// let backendSrvAddress = "0x264FA8E2eB01517E96fe4Ea79541cf34C6691CB6";

// Testnet
let depositFee = 50;
let backendSrvAddress = "0x5900232e3eA7ffFF283490aE949b61E400d7f39D";
let balancerAddress = "0x6Bc32575ACb8754886dC283c2c8ac54B1Bd93195";

let token = bnbToken;
let resourceId = bnbResourceId;
let chainID = bnbMainChainId;

module.exports = async function (deployer, network, accounts) {
  // let bridge = await Bridge.at("0xf8A8c862fa1CC483c7330539869326da85211008");
  const bridge = await deployProxy(
    Bridge,
    [chainID, depositFee, backendSrvAddress, balancerAddress],
    { deployer }
  );

  console.log("Bridge address: " + bridge.address);

  // // await deployer.deploy(ERC20Handler);
  // const handler = await ERC20Handler.deployed();
  const handler = await deployProxy(ERC20Handler, [bridge.address], {
    deployer,
  });

  console.log("Handler address: " + handler.address);

  console.log(await bridge.setResource(handler.address, resourceId, token)); //map resourceID to token and handler of that token

  // let bridge = await Bridge.at("0x3e1dBc78dadc567e193671A768C9B3CA8E9cD05c");
  // const bridge = await deployProxy(Bridge, [chainID, depositFee, backendSrvAddress], {deployer: deployer})
  // const bridge = await upgradeProxy("0x3e1dBc78dadc567e193671A768C9B3CA8E9cD05c", Bridge, {deployer: deployer})
  // let bridge1 = await Bridge.deployed();
  // console.log("Bridge address: "+ bridge.address );

  // const handler = await deployProxy(ERC20Handler, [bridge.address], {deployer: deployer})
  // let handler = await ERC20Handler.at("0x26B11bd5347cf5f700464ae81d49fc11F08AEE51");
  // let handler = await ERC20Handler.deployed();
  // console.log("Handler address: "+ handler.address);

  let usdt = await ExampleToken.at("0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee")
  // console.log( await usdt.balanceOf("0x2F72Ac9e13b7b8364aC95AB892252e699040C99a"))
  // console.log(await usdt.transfer(handler.address, 50000000000000))
  console.log(await bridge.setResource(handler.address, usdtRecourceID, usdt.address, {from: accounts[0]})); //map resourceID to token and handler of that token
  // console.log(await bridge.adminSetResource(handler.address, usdtRecourceID, usdt.address)); //map resourceID to token and handler of that token
  // console.log(await bridge._nativeResourceID())
}
