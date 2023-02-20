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

contract('ERC20Handler - [Burn ERC20]', async (accounts) => {
    const chainID = Helpers.createChainID();
    const backendSrvAddress = accounts[1];

    let BridgeInstance;
    let ERC20MintableInstance1;
    let ERC20MintableInstance2;
    let resourceID1;
    let resourceID2;
    let burnableContractAddress;
    let ERC20HandlerInstance;

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new(chainID, 0, backendSrvAddress)
        ERC20MintableInstance1 = await ERC20MintableContract.new("token", "TOK", 18)
        ERC20MintableInstance2 = await ERC20MintableContract.new("token", "TOK", 18)

        resourceID1 = Ethers.utils.hexZeroPad((ERC20MintableInstance1.address + Ethers.utils.hexlify(chainID).substr(2)), 32);
        resourceID2 = Ethers.utils.hexZeroPad((ERC20MintableInstance2.address + Ethers.utils.hexlify(chainID).substr(2)), 32);
        burnableContractAddress = ERC20MintableInstance2.address;
        ERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address);
    });

    it('[sanity] contract should be initialised successfully', async () => {
        assert.equal(await ERC20HandlerInstance._bridgeAddress(), BridgeInstance.address);
    });

    it('burnableContractAddresses should be marked true in _burnList', async () => {
        TruffleAssert.passes(await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID2, burnableContractAddress))
        TruffleAssert.passes(await BridgeInstance.adminSetBurnable(ERC20HandlerInstance.address, burnableContractAddress))

        const isBurnable = await ERC20HandlerInstance._burnList.call(burnableContractAddress);
        assert.isTrue(isBurnable, "Contract wasn't successfully marked burnable");
    });

    it('ERC20MintableInstance1.address should not be marked true in _burnList', async () => {
        TruffleAssert.passes(await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID2, burnableContractAddress))
        TruffleAssert.passes(await BridgeInstance.adminSetBurnable(ERC20HandlerInstance.address, burnableContractAddress))

        const isBurnable = await ERC20HandlerInstance._burnList.call(ERC20MintableInstance1.address);
        assert.isFalse(isBurnable, "Contract shouldn't be marked burnable");
    });

    it('ERC20MintableInstance1.address should be marked true in _burnList after setBurnable is called', async () => {
        TruffleAssert.passes(await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID1, ERC20MintableInstance1.address))
        await BridgeInstance.adminSetBurnable(ERC20HandlerInstance.address, ERC20MintableInstance1.address);
        const isBurnable = await ERC20HandlerInstance._burnList.call(ERC20MintableInstance1.address);
        assert.isTrue(isBurnable, "Contract wasn't successfully marked burnable");
    });
});
