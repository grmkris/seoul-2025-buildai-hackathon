// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./erc721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Factory is Ownable {
    address[] public deployedContracts;

    event NFTContractDeployed(address indexed contractAddress, address indexed deployer, string name, string symbol);

    constructor() Ownable(msg.sender) {}

    function deployNFTContract(string memory name, string memory symbol)
        public
        returns (address)
    {
        // The owner of the factory will become the owner of the new Forehead721 contract
        Forehead721 newNFT = new Forehead721(owner(), name, symbol);
        address newContractAddress = address(newNFT);
        deployedContracts.push(newContractAddress);

        emit NFTContractDeployed(newContractAddress, owner(), name, symbol);
        return newContractAddress;
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}
