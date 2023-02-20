/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ExampleToken");
const ERC20HandlerContract = artifacts.require("ERC20Handler");
const Helpers = require("../helpers");

contract('ERC20Handler - [isWhitelisted]', async (accounts) => {
    const chainID = Helpers.createChainID();
    const backendSrvAddress = accounts[1]

    let BridgeInstance;
    let ERC20MintableInstance;
    let ERC20HandlerInstance;
    let resourceID1;

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new(chainID, 0, backendSrvAddress)
        ERC20MintableInstance = await ERC20MintableContract.new("token", "TOK", 18)

        resourceID1 = Helpers.createResourceID(ERC20MintableInstance.address, chainID)
        ERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address);
    });

    it('ERC20MintableContract address should be whitelisted', async () => {
        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID1, ERC20MintableInstance.address)
        const isWhitelisted = await ERC20HandlerInstance._contractWhitelist.call(ERC20MintableInstance.address);
        assert.isTrue(isWhitelisted, "Contract wasn't successfully whitelisted");
    });

});
