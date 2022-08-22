pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./utils/Ownable.sol";

/// @title SonarMeta model collection
/// @author SonarX Team
contract ModelCollection is ERC721, Ownable {

    // Mapping from token ID to granted addresses
    mapping(uint256 => mapping(address => bool)) private grantedToken;
    // Mapping from token Id to approved granting addresses
    mapping(uint256 => mapping(address => bool)) private approvedGranting;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {

    }

    function approveGrant(address from, address to, uint256 tokenId) public {
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

    function _grant(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "fno");
        require(to != address(0), "ti0");
        grantedToken[tokenId][to] = true;
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        require(to != address(0), "ti0");
        _safeMint(to, tokenId);
    }

    function isGranted(address _address, uint256 tokenId) public view returns (bool) {
        _requireMinted(tokenId);
        return grantedToken[tokenId][_address];
    }

}
