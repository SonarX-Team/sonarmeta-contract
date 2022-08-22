// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Storage.sol";
import "./Events.sol";
import "./ReentrancyGuard.sol";
import "./Config.sol";

/// @title SonarMeta main contract
/// @author SonarX Team
contract SonarMeta is Storage, Events, ReentrancyGuard, Context, Config, Ownable {

    constructor(address _tokenAddress, address _modelCollectionAddress) {
        initializeReentrancyGuard();

        ERC20Token = Token(_tokenAddress);
        ERC721ModelCollection = ModelCollection(_modelCollectionAddress);
    }

    function applyForAirdrop() external nonReentrant {
        require(appliedAirdropWhitelist[_msgSender()] == false, "haa");
        ERC20Token.airdrop(_msgSender(), AIRDROP_AMOUNT);
        appliedAirdropWhitelist[_msgSender()] = true;
    }

    function getERC20Balance(address _owner) external returns (uint256) {
        require(_owner != address(0), "oi0");
        return ERC20Token.balanceOf(_owner);
    }

    function approveERC20ToSonarMeta(uint256 _amount) external nonReentrant {
        require(_amount != 0, "ai0");
        require(ERC20Token.approve(address(this), _amount), "af");
    }

    function transferERC20(address _to, uint256 _amount) external nonReentrant {
        require(_amount != 0, "ai0");
        require(_to != address(0), "ti0");
        require(ERC20Token.transfer(_to, _amount), "tf");
    }

    function transferERC20UsingSonarMetaAllowance(address _to, uint256 _amount) external nonReentrant {
        require(_amount != 0, "ai0");
        require(_to != address(0), "ti0");
        require(ERC20Token.transferFrom(address(this), _to, _amount), "tf");
    }

    function approveGrantERC721ToSonarMeta(uint256 _tokenId, address _to) external nonReentrant {
        require(_to != address(0), "ti0");
        ERC721ModelCollection.approveGrant(_to, _tokenId);
    }

    function approveERC721ToSonarMeta(uint256 _tokenId, address _to) external nonReentrant {
        require(_to != address(0), "ti0");
        ERC721ModelCollection.approve(_to, _tokenId);
    }

    function grantERC721(uint256 _tokenId, address _to) external nonReentrant {
        require(_to != address(0), "ti0");
        address owner = ERC721ModelCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ERC721ModelCollection.grantFrom(owner, _to, _tokenId);
    }

    function transferERC721(uint256 _tokenId, address _to) external nonReentrant {
        require(_to != address(0), "ti0");
        address owner = ERC721ModelCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ERC721ModelCollection.transferFrom(owner, _to, _tokenId);
    }

    function mintERC721(address _to, uint256 _tokenId) external nonReentrant {
        require(_to!= address(0), "ti0");
        ERC721ModelCollection.mint(_to, _tokenId);
    }

}
