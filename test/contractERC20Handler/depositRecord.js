/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const Ethers = require('ethers');

const Helpers = require('../helpers');

const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ExampleToken");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('ERC20Handler - [Deposit]', async (accounts) => {
    const chainID = Helpers.createChainID();
    const expectedDepositNonce = 1;
    const backendSrvAddress = accounts[1];
    const depositerAddress = accounts[2];
    const tokenAmount = 100;

    let BridgeInstance;
    let ERC20MintableInstance;
    let ERC20HandlerInstance;

    let resourceID;

    beforeEach(async () => {
        BridgeInstance = await BridgeContract.new(chainID, 0, backendSrvAddress)
        ERC20MintableInstance = await ERC20MintableContract.new("token", "TOK", 18)

        resourceID = Helpers.createResourceID(ERC20MintableInstance.address, chainID);

        ERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address)
        await ERC20MintableInstance.mint(depositerAddress, tokenAmount)

        await ERC20MintableInstance.approve(ERC20HandlerInstance.address, tokenAmount, { from: depositerAddress })
        await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID, ERC20MintableInstance.address)
    });

    it('[sanity] depositer owns tokenAmount of ERC20', async () => {
        const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress);
        assert.equal(tokenAmount, depositerBalance);
    });

    it('[sanity] ERC20HandlerInstance.address has an allowance of tokenAmount from depositerAddress', async () => {
        const handlerAllowance = await ERC20MintableInstance.allowance(depositerAddress, ERC20HandlerInstance.address);
        assert.equal(tokenAmount, handlerAllowance);
    });

    it('[sanity] should create depositRecord with desired values', async () => {
        const recipientAddress = accounts[3];
        const expectedDepositRecord = {
            _tokenAddress: ERC20MintableInstance.address,
            _destinationChainID: chainID,
            _resourceID: resourceID,
            _destinationRecipientAddress: recipientAddress,
            _depositer: depositerAddress,
            _amount: tokenAmount
        };

        await BridgeInstance.deposit(
            chainID,
            resourceID,
            tokenAmount, recipientAddress,
            { from: depositerAddress }
        );

        const depositRecord = await ERC20HandlerInstance.getDepositRecord(expectedDepositNonce, chainID);
        Helpers.assertObjectsMatch(expectedDepositRecord, Object.assign({}, depositRecord));
    });
});

