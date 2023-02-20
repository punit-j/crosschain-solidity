const Ethers = require("Ethers")
const Web3 = require('web3')
const toHex = (covertThis, padding) => {
  return Ethers.utils.hexZeroPad(Ethers.utils.hexlify(covertThis), padding);
};

const web3 = new Web3("https://rpc-testnet.lachain.io")
// const createERCDepositData = (tokenAmountOrID, lenRecipientAddress, recipientAddress) => {
//   return '0x' +
//       toHex(tokenAmountOrID, 32).substr(2) +      // Token amount or ID to deposit (32 bytes)
//       toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)          (32 bytes)
//       recipientAddress.substr(2);               // recipientAddress               (?? bytes)
// };

const generateChainID = str => {
  let chainID = Ethers.utils.hexZeroPad(web3.utils.toHex(str), 8)
  return chainID
}

const generateResourceID = (lachainTokenAddr, otherChainTokenAddr) => {
  let resourceID = Ethers.utils.hexZeroPad(Ethers.utils.hexlify(lachainTokenAddr.substr(0,25) + otherChainTokenAddr.substr(15) ), 32)
  return resourceID
}
// let recipient = "0x0e3aC56774E282F7fF4F544ef996F1cf4331C3c5"
// console.log(createERCDepositData(10, 20, recipient))
var BN = web3.utils.BN
// console.log(generateResourceID("0xc4f76f223a578FF90Cc9472E1bf8Acfd3F37348b", "0xd63d4b4371a84D0C3E67679Ef7c824f2d81B4C0F"))
// console.log(web3.eth.abi.encodeFunctionSignature('getValue()'))
// console.log(web3.eth.accounts.create())
// console.log(web3.utils.randomHex(32))
// console.log(web3.utils.hexToAscii("0x63dd553807ea27cb996173133b29a47f29c6b3bec34043271f5a5f7dd1f949c9"))
console.log(web3.utils.sha3("updateExternalTx(bytes8,bytes8,uint64,bytes32,address,uint256,bytes,uint8)"))
// console.log(generateChainID("1"))
// console.log(web3.utils.toHex(web3.utils.toBN("25").toString()))
// console.log("0x"+parseInt("25", 16))