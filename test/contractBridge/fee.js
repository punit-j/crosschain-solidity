/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const TruffleAssert = require('truffle-assertions');
const Ethers = require('ethers');

const Helpers = require('../helpers');

const BridgeContract = artifacts.require("Bridge");
const ERC20MintableContract = artifacts.require("ExampleToken");
const ERC20HandlerContract = artifacts.require("ERC20Handler");

contract('Bridge - [fee]', async (accounts) => {
    const originChainID = Helpers.createChainID();
    const destinationChainID = Helpers.createChainID();
    const admin = accounts[0];
    const backendSrvAddress = accounts[1];
    const depositerAddress = accounts[2];
    const recipientAddress = accounts[3];
    const originChainInitialTokenAmount = 100;
    const depositAmount = 10;

    let BridgeInstance;
    let OriginERC20MintableInstance;
    let OriginERC20HandlerInstance;
    let resourceID;

    beforeEach(async () => {
        OriginERC20MintableInstance = await ERC20MintableContract.new("token", "TOK", 18)
        BridgeInstance = await BridgeContract.new(originChainID, 0, backendSrvAddress)

        resourceID = Helpers.createResourceID(OriginERC20MintableInstance.address, originChainID);

        OriginERC20HandlerInstance = await ERC20HandlerContract.new(BridgeInstance.address);

        await BridgeInstance.adminSetResource(OriginERC20HandlerInstance.address, resourceID, OriginERC20MintableInstance.address)
        await OriginERC20MintableInstance.mint(depositerAddress, originChainInitialTokenAmount)
        await OriginERC20MintableInstance.approve(OriginERC20HandlerInstance.address, depositAmount * 2, { from: depositerAddress });
    });

    it('[sanity] deposit can be made', async () => {
        await TruffleAssert.passes(BridgeInstance.deposit(
            destinationChainID,
            resourceID,
            depositAmount, recipientAddress,
            { from: depositerAddress, value: 0 }
        ));
    });

    it('deposit reverts if invalid amount supplied', async () => {
        // current fee is set to 0
        assert.equal(await BridgeInstance._fee.call(), 0)
        // Change fee to 0.5 ether
        await BridgeInstance.adminChangeFee(Ethers.utils.parseEther("0.5"), { from: admin })
        assert.equal(web3.utils.fromWei((await BridgeInstance._fee.call()), "ether"), "0.5");
        
        await TruffleAssert.fails(
            BridgeInstance.deposit(
                destinationChainID,
                resourceID,
                depositAmount, recipientAddress,
                { from: depositerAddress, value: 10 }
            )
        )
    });

    it('deposit passes if valid amount supplied', async () => {
        // current fee is set to 0
        assert.equal(await BridgeInstance._fee.call(), 0)
        // Change fee to 0.5 ether
        await BridgeInstance.adminChangeFee(Ethers.utils.parseEther("0.5"), { from: admin })
        assert.equal(web3.utils.fromWei((await BridgeInstance._fee.call()), "ether"), "0.5");

        await TruffleAssert.passes(
            BridgeInstance.deposit(
                destinationChainID,
                resourceID,
                depositAmount, recipientAddress,
                {
                    value: Ethers.utils.parseEther("0.5"),
                    from: depositerAddress
                }
            )
        )
    });
})