pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "./thirdparty/ERC20.sol";

contract Token is ERC20, Ownable {

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {

    }

    function airdrop(address applicant, uint256 amount) onlyOwner external {
        _mint(applicant, amount);
    }

}
