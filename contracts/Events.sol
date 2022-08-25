pragma solidity ^0.8.0;

/// @title Events
/// @author SonarX Team
interface Events {

    /// @notice Event emitted when a airdrop is committed
    event Fund(address indexed _to, uint256 _amount);

    /// @notice Event emitted when mint a model
    event MintModelFor(address indexed _to, uint256 indexed _tokenId);

    /// @notice Event emitted when mint a scene
    event MintSceneFor(address indexed _to, uint256 indexed _tokenId);


}
