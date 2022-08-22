pragma solidity ^0.8.0;

import "./Token.sol";
import "./ModelCollection.sol";

/// @title SonarMeta storage contract
/// @author SonarX Team
contract Storage {

    mapping(address => bool) internal appliedAirdropWhitelist;

    Token internal ERC20Token;

    ModelCollection internal ERC721ModelCollection;

}
