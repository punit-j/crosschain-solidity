/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const TruffleAssert = require('truffle-assertions');

const Helpers = require('../helpers');

const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ExampleToken");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('Bridge - [deposit - ERC20]', async (accounts) => {
    const originChainID = Helpers.createChainID();
    const destinationChainID = Helpers.createChainID();
    const backendSrvAddress = accounts[1];
    const depositerAddress = accounts[2];
    const recipientAddress = accounts[3];
    const originChainInitialTokenAmount = 100;
    const depositAmount = 10;
    const expectedDepositNonce = 1;

    let BridgeInstance;
    let OriginERC20MintableInstance;
    let OriginERC20HandlerInstance;
    let resourceID;

    beforeEach(async () => {
        OriginERC20MintableInstance = await ERC20MintableContract.new("token", "TOK", 18)
        BridgeInstance = await BridgeContract.new(originChainID, 10, backendSrvAddress)

        resourceID = Helpers.createResourceID(OriginERC20MintableInstance.address, originChainID)

        OriginERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address);

        await BridgeInstance.adminSetResource(OriginERC20HandlerInstance.address, resourceID, OriginERC20MintableInstance.address)
        await OriginERC20MintableInstance.mint(depositerAddress, originChainInitialTokenAmount)
        await OriginERC20MintableInstance.approve(OriginERC20HandlerInstance.address, depositAmount * 2, { from: depositerAddress });

    });

    it("[sanity] test depositerAddress' balance", async () => {
        const originChainDepositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(originChainDepositerBalance.toNumber(), originChainInitialTokenAmount);
    });

    it("[sanity] test OriginERC20HandlerInstance.address' allowance", async () => {
        const originChainHandlerAllowance = await OriginERC20MintableInstance.allowance(depositerAddress, OriginERC20HandlerInstance.address);
        assert.strictEqual(originChainHandlerAllowance.toNumber(), depositAmount * 2);
    });

    it('[sanity] ERC20 deposit can be made with right fee', async () => {
        TruffleAssert.passes(await BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 10 }
        ));
    });

    it('_depositCounts should be increments from 0 to 1', async () => {
        await BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 10 }
        );

        const depositCount = await BridgeInstance._depositCounts.call(destinationChainID);
        assert.strictEqual(depositCount.toNumber(), expectedDepositNonce);
    });

    it('ERC20 can be deposited with correct balances', async () => {
        await BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 10 }
        );

        const originChainDepositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(originChainDepositerBalance.toNumber(), originChainInitialTokenAmount - depositAmount);

        const originChainHandlerBalance = await OriginERC20MintableInstance.balanceOf(OriginERC20HandlerInstance.address);
        assert.strictEqual(originChainHandlerBalance.toNumber(), depositAmount);
    });

    it('Deposit event is fired with expected value', async () => {
        let depositTx = await BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 10 }
        );

        TruffleAssert.eventEmitted(depositTx, 'Deposit', ev => {
            return (
                ev.destinationChainID.substr(0, 18) == destinationChainID &&
                ev.resourceID == resourceID.toLowerCase() &&
                ev.depositNonce == expectedDepositNonce &&
                ev.depositor == depositerAddress &&
                ev.recipientAddress == recipientAddress &&
                ev.tokenAddress == OriginERC20MintableInstance.address &&
                ev.amount == depositAmount
            )
        });

        depositTx = await BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 10 }
        );

        TruffleAssert.eventEmitted(depositTx, 'Deposit', (ev) => {
            return (
                ev.destinationChainID.substr(0, 18) == destinationChainID &&
                ev.resourceID == resourceID.toLowerCase() &&
                ev.depositNonce == expectedDepositNonce + 1 &&
                ev.depositor == depositerAddress &&
                ev.recipientAddress == recipientAddress &&
                ev.tokenAddress == OriginERC20MintableInstance.address &&
                ev.amount == depositAmount
            )
        });
    });
});