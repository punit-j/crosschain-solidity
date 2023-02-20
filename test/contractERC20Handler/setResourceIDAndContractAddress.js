/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const Helpers = require("../helpers");

const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ExampleToken");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('ERC20Handler - [setResourceIDAndContractAddress]', async (accounts) => {
    const chainID = Helpers.createChainID();
    const backendSrvAddress = accounts[1];

    let BridgeInstance;
    let ERC20MintableInstance;
    let ERC20HandlerInstance;
    let resourceID;

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new(chainID, 0, backendSrvAddress);
        ERC20MintableInstance = await ERC20MintableContract.new("token", "TOK", 18);

        resourceID = Helpers.createResourceID(ERC20MintableInstance.address, chainID)

        ERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address)
        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID, ERC20MintableInstance.address);
    });

    it("[sanity] ERC20MintableInstance1's resourceID and contract address should be set correctly", async () => {
        const retrievedTokenAddress = await ERC20HandlerInstance._resourceIDToTokenContractAddress.call(resourceID);
        assert.strictEqual(Ethers.utils.getAddress(ERC20MintableInstance.address), retrievedTokenAddress);

        const retrievedResourceID = await ERC20HandlerInstance._tokenContractAddressToResourceID.call(ERC20MintableInstance.address);
        assert.strictEqual(resourceID.toLowerCase(), retrievedResourceID.toLowerCase());
    });

    it('new resourceID and corresponding contract address should be set correctly', async () => {
        const ERC20MintableInstance2 = await ERC20MintableContract.new("token", "TOK", 18);
        const secondERC20ResourceID = Helpers.createResourceID(ERC20MintableInstance2.address, chainID)

        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, secondERC20ResourceID, ERC20MintableInstance2.address);

        const retrievedTokenAddress = await ERC20HandlerInstance._resourceIDToTokenContractAddress.call(secondERC20ResourceID);
        assert.strictEqual(Ethers.utils.getAddress(ERC20MintableInstance2.address).toLowerCase(), retrievedTokenAddress.toLowerCase());

        const retrievedResourceID = await ERC20HandlerInstance._tokenContractAddressToResourceID.call(ERC20MintableInstance2.address);
        assert.strictEqual(secondERC20ResourceID.toLowerCase(), retrievedResourceID.toLowerCase());
    });

    it('existing resourceID should be updated correctly with new token contract address', async () => {
        const ERC20MintableInstance2 = await ERC20MintableContract.new("token", "TOK", 18);
        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID, ERC20MintableInstance2.address);

        const retrievedTokenAddress = await ERC20HandlerInstance._resourceIDToTokenContractAddress.call(resourceID);
        assert.strictEqual(ERC20MintableInstance2.address, retrievedTokenAddress);

        const retrievedResourceID = await ERC20HandlerInstance._tokenContractAddressToResourceID.call(ERC20MintableInstance2.address);
        assert.strictEqual(resourceID.toLowerCase(), retrievedResourceID.toLowerCase());
    });

    it('existing resourceID should be updated correctly with new handler address', async () => {
        const ERC20MintableInstance2 = await ERC20MintableContract.new("token", "TOK", 18);
        ERC20HandlerInstance2 = await ERC20HandlerContract.new(BridgeInstance.address);

        await BridgeInstance.adminSetResource(ERC20HandlerInstance2.address, resourceID, ERC20MintableInstance2.address);

        const bridgeHandlerAddress = await BridgeInstance._resourceIDToHandlerAddress.call(resourceID);
        assert.strictEqual(bridgeHandlerAddress.toLowerCase(), ERC20HandlerInstance2.address.toLowerCase());
    });

    it('existing resourceID should be replaced by new resourceID in handler', async () => {
        const ERC20MintableInstance2 = await ERC20MintableContract.new("token", "TOK", 18);
        const secondERC20ResourceID = Helpers.createResourceID(ERC20MintableInstance2.address, chainID);

        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, secondERC20ResourceID, ERC20MintableInstance.address);

        const retrievedResourceID = await ERC20HandlerInstance._tokenContractAddressToResourceID.call(ERC20MintableInstance.address);
        assert.strictEqual(secondERC20ResourceID.toLowerCase(), retrievedResourceID.toLowerCase());

        const retrievedContractAddress = await ERC20HandlerInstance._resourceIDToTokenContractAddress.call(secondERC20ResourceID);
        assert.strictEqual(retrievedContractAddress.toLowerCase(), ERC20MintableInstance.address.toLowerCase());
    });
});
