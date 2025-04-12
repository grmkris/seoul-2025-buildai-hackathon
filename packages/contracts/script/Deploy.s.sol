// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { Transfers } from "../src/payment/transfers/Transfers.sol";
import { IUniversalRouter } from "@uniswap/universal-router/contracts/interfaces/IUniversalRouter.sol";
import { IPermit2 } from "../src/payment/interfaces/permit2/IPermit2.sol";
import { IWrappedNativeCurrency } from "../src/payment/interfaces/IWrappedNativeCurrency.sol";

import { BaseScript } from "./Base.s.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is BaseScript {
    function run() public broadcast returns (Transfers transfers) {
        // Fetch addresses from environment variables
        // Make sure to set these in your .env file or environment
        IUniversalRouter uniswapRouter = IUniversalRouter(vm.envAddress("UNISWAP_ROUTER_ADDRESS"));
        IPermit2 permit2 = IPermit2(vm.envAddress("PERMIT2_ADDRESS"));
        address initialOperator = vm.envAddress("INITIAL_OPERATOR_ADDRESS");
        address initialFeeDestination = vm.envAddress("INITIAL_FEE_DESTINATION_ADDRESS");
        IWrappedNativeCurrency wrappedNativeCurrency = IWrappedNativeCurrency(vm.envAddress("WRAPPED_NATIVE_CURRENCY_ADDRESS"));

        transfers = new Transfers(
            uniswapRouter,
            permit2,
            initialOperator,
            initialFeeDestination,
            wrappedNativeCurrency
        );
    }
}
