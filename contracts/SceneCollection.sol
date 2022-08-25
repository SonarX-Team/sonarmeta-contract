pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ModelCollection.sol";
import "./utils/Counters.sol";

/// @title SonarMeta scene collection
/// @author SonarX Team
contract SceneCollection is ERC721, Ownable {

    using Counters for Counters.Counter;
    // Auto increment counter
    Counters.Counter private _index;

    ModelCollection private components;

    // Mapping from token ID to components
    mapping(uint256 => mapping(uint256 => bool)) private combination;

    // Mapping from token ID to granted addresses
    mapping(uint256 => mapping(address => bool)) private grantedToken;
    // Mapping from token Id to approved granting addresses
    mapping(uint256 => mapping(address => bool)) private approvedGranting;

    constructor(string memory _name, string memory _symbol, address _componentsAddress) ERC721(_name, _symbol) {
        components = ModelCollection(_componentsAddress);
    }

    function approveGrant(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "gtco");
        /// grant to current owner
        require(
            _msgSender() == owner,
            "np"
        );
        _approveGrant(to, tokenId);
    }

    function _approveGrant(address to, uint256 tokenId) internal {
        approvedGranting[tokenId][to] = true;
    }

    function grantFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedGrantingAddressOrOwner(_msgSender(), tokenId), "np");
        _grant(from, to, tokenId);
    }

    /// @dev Spender may be the owner or the approved granting address
    function _isApprovedGrantingAddressOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedGranting(tokenId, spender));
    }

    function isApprovedGranting(uint256 tokenId, address addr) public view returns (bool) {
        _requireMinted(tokenId);
        return approvedGranting[tokenId][addr];
    }

    function isGranted(address _address, uint256 tokenId) public view returns (bool) {
        _requireMinted(tokenId);
        return grantedToken[tokenId][_address];
    }

    function _grant(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "fno");
        require(to != address(0), "ti0");
        grantedToken[tokenId][to] = true;
    }


    function addChild(uint256 tokenId, uint256 childTokenId) public {
        _addChild(tokenId, childTokenId);
    }

    function _addChild(uint256 tokenId, uint256 childTokenId) internal {
        _requireMinted(tokenId);
        address owner = ownerOf(tokenId);
        require(components.ownerOf(childTokenId) == owner || components.isGranted(owner, childTokenId), "np");
        require(combination[tokenId][childTokenId] == false, "ha");
        combination[tokenId][childTokenId] = true;
    }

    function removeChild(uint256 tokenId, uint256 childTokenId) public {
        _removeChild(tokenId, childTokenId);
    }

    function _removeChild(uint256 tokenId, uint256 childTokenId) internal {
        _requireMinted(tokenId);
        address owner = ownerOf(tokenId);
        require(components.ownerOf(childTokenId) == owner || components.isGranted(owner, childTokenId), "np");
        require(combination[tokenId][childTokenId] == true, "na");
        combination[tokenId][childTokenId] = false;
    }

    function mint(address to) public onlyOwner returns(uint256) {
        require(to != address(0), "ti0");
        uint256 index = _index.current();
        _safeMint(to, index);
        _index.increment();
        return index;
    }

    function mintFromBatchTokens(address to, uint256[] calldata childTokenIds) public onlyOwner returns(uint256) {
        require(to != address(0), "ti0");
        uint256 index = _index.current();
        _safeMint(to, index);

        for (uint256 i = 0; i < childTokenIds.length; ++i) {
            uint256 childTokenId = childTokenIds[i];
            _addChild(index, childTokenId);
        }

        _index.increment();
        return index;
    }

}
