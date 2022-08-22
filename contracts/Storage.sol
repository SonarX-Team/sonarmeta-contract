pragma solidity ^0.8.0;

import "./Token.sol";
import "./ModelCollection.sol";
import "./Governance.sol";
import "./SceneCollection.sol";

/// @title SonarMeta storage contract
/// @author SonarX Team
contract Storage {

    mapping(address => bool) internal appliedAirdropWhitelist;

    Governance internal governance;

    Token internal ERC20Token;

    ModelCollection internal ERC721ModelCollection;

    SceneCollection internal ModifiedERC998SceneCollection;

}
