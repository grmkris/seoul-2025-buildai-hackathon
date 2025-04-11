// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {ERC721Factory} from "../src/erc721Factory.sol";
import {Forehead721} from "../src/erc721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; // Needed for Owner interface

contract ERC721FactoryTest is Test {
    ERC721Factory public factory;
    address public owner; // The deployer of the factory and initial owner
    address public user1 = address(0x1);

    event NFTContractDeployed(
        address indexed contractAddress,
        address indexed deployer,
        string name,
        string symbol
    );

    function setUp() public {
        owner = address(this);
        factory = new ERC721Factory();
    }

    function test_DeployAndMint() public {
        string memory name = "Test Forehead";
        string memory symbol = "TFH";
        string memory metadataURI = "ipfs://example";
        uint256 expectedTokenId = 0;

        // 1. Expect the deployment event
        vm.expectEmit(false, true, true, true);
        emit NFTContractDeployed(address(0), owner, name, symbol); // The address(0) here is ignored due to the 'false' above

        // 2. Deploy the NFT contract via the factory
        address deployedAddress = factory.deployNFTContract(name, symbol);

        // Check it's not the zero address
        assertNotEq(deployedAddress, address(0));

        // 3. Get an instance of the deployed contract
        Forehead721 deployedNFT = Forehead721(deployedAddress);

        // 4. Verify the factory owner is the owner of the new contract
        assertEq(deployedNFT.owner(), owner, "Factory owner should be NFT owner");

        // 5. Mint an NFT (as the owner)
        uint256 mintedTokenId = deployedNFT.safeMint(user1, metadataURI);
        assertEq(mintedTokenId, expectedTokenId, "Incorrect token ID minted");

        // 6. Verify NFT ownership and URI
        assertEq(deployedNFT.balanceOf(user1), 1, "User1 should own 1 NFT");
        assertEq(deployedNFT.ownerOf(mintedTokenId), user1, "User1 should be owner of token 0");
        assertEq(deployedNFT.tokenURI(mintedTokenId), metadataURI, "Token URI mismatch");

        // 7. Verify factory contract tracking
        address[] memory deployedContracts = factory.getDeployedContracts();
        assertEq(deployedContracts.length, 1, "Factory should track 1 contract");
        assertEq(deployedContracts[0], deployedAddress, "Factory tracking mismatch");
    }
}
