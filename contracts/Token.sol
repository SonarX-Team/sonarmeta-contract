pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20, Ownable {

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {

    }

    function airdrop(address _applicant, uint256 _amount) onlyOwner external {
        _mint(_applicant, _amount);
    }

}
