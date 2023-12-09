// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Assessment {
    address owner;
    uint256 totalFunds;

    mapping(address => uint256) public contributions;
    address[] public participants;

    constructor() {
        owner = msg.sender;
    }

    function donate() public {
        if (contributions[msg.sender] == 0) {
            participants.push(msg.sender);
        }
        contributions[msg.sender] += 1;
        totalFunds+=1;
    }

    function getTotalParticipants() public view returns (uint256) {
        return participants.length;
    }

    function getTotalFunds() public view returns (uint256) {
        return totalFunds;
    }

    function getUserDonations() public view returns (uint256) {
        return contributions[msg.sender];
    }
    fallback() external{
        donate();
    }
}
