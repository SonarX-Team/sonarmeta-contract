// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Storage.sol";
import "./Events.sol";
import "./ReentrancyGuard.sol";
import "./Config.sol";
import "./Governance.sol";

/// @title SonarMeta main contract
/// @author SonarX Team
contract SonarMeta is Governance, Storage, Events, ReentrancyGuard, Context, Config, Ownable {

    constructor(address _tokenAddress, address _modelCollectionAddress, address _sceneCollectionAddress, address _governanceAddress) {
        initializeReentrancyGuard();

        governance = Governance(_governanceAddress);
        ERC20Token = Token(_tokenAddress);
        ERC721ModelCollection = ModelCollection(_modelCollectionAddress);
        ModifiedERC998SceneCollection = SceneCollection(_sceneCollectionAddress);
    }

    function applyForAirdrop() external nonReentrant {
        require(appliedAirdropWhitelist[_msgSender()] == false, "haa");
        ERC20Token.airdrop(_msgSender(), AIRDROP_AMOUNT);
        appliedAirdropWhitelist[_msgSender()] = true;
    }

    function fundTreasury(uint256 _amount) external nonReentrant {
        governance.requireController(_msgSender());
        require(governance.treasury() != address(0), "tsi0");
        ERC20Token.airdrop(governance.treasury(), _amount);
    }

    function transferERC20UsingSonarMetaAllowance(address _to, uint256 _amount) external nonReentrant {
        governance.requireController(_msgSender());
        require(_amount != 0, "ai0");
        require(_to != address(0), "ti0");
        require(ERC20Token.transferFrom(address(this), _to, _amount), "tf");
    }

    function grantERC721UsingSonarMetaApproval(uint256 _tokenId, address _to) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to != address(0), "ti0");
        address owner = ERC721ModelCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ERC721ModelCollection.grantFrom(owner, _to, _tokenId);
    }

    function transferERC721UsingSonarMetaApproval(uint256 _tokenId, address _to) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to != address(0), "ti0");
        address owner = ERC721ModelCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ERC721ModelCollection.transferFrom(owner, _to, _tokenId);
    }

    function mintERC721(address _to, uint256 _tokenId) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to!= address(0), "ti0");
        ERC721ModelCollection.mint(_to, _tokenId);
    }

    function grantERC998UsingSonarMetaApproval(uint256 _tokenId, address _to) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to != address(0), "ti0");
        address owner = ModifiedERC998SceneCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ModifiedERC998SceneCollection.grantFrom(owner, _to, _tokenId);
    }

    function transferERC998UsingSonarMetaApproval(uint256 _tokenId, address _to) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to != address(0), "ti0");
        address owner = ModifiedERC998SceneCollection.ownerOf(_tokenId);
        /// @dev owner cannot be '0' because it is checked inside 'ownerOf'.
        ModifiedERC998SceneCollection.transferFrom(owner, _to, _tokenId);
    }

    function mintERC998(address _to, uint256 _tokenId) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to!= address(0), "ti0");
        ModifiedERC998SceneCollection.mint(_to, _tokenId);
    }

    function mintERC998WithBatchTokens(address _to, uint256 _tokenId, uint256[] calldata _childTokenIds) external nonReentrant {
        governance.requireController(_msgSender());
        require(_to!= address(0), "ti0");
        ModifiedERC998SceneCollection.mintFromBatchTokens(_to, _tokenId, _childTokenIds);
    }

}
