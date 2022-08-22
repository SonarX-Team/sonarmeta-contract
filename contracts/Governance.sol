pragma solidity ^0.8.0;

/// @title SonarMeta Governance contract
/// @author SonarX Team
contract Governance {

    /// @notice Address which governs SonarMeta
    address public networkGovernor;

    /// @notice Address which belongs to SonarMeta, taking control of tokens
    mapping(address => bool) public networkControllers;


    /// @notice Check if specified address is is governor
    /// @param _address Address to check
    function requireGovernor(address _address) public view {
        require(_address == networkGovernor, "ng"); // only by governor
    }

    /// @notice Check if specified address is is controller
    /// @param _address Address to check
    function requireController(address _address) public view {
        require(networkControllers[_address], "nc"); // only by controller
    }

    /// @notice Change current governor
    /// @param _newGovernor Address of the new governor
    function changeGovernor(address _newGovernor) external {
        requireGovernor(msg.sender);
        if (networkGovernor != _newGovernor) {
            networkGovernor = _newGovernor;
        }
    }

    /// @notice Change controller status (active or not active)
    /// @param _controller Controller address
    /// @param _active Active flag
    function setController(address _controller, bool _active) external {
        requireGovernor(msg.sender);
        if (networkControllers[_controller] != _active) {
            networkControllers[_controller] = _active;
        }
    }
}
