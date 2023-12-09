// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
   address payable public owner;
   uint256 public balance;
   uint256 amountOfTransactions;

   event Deposit(uint256 amount);
   event Withdraw(uint256 amount);

   constructor(uint initBalance) payable {
       owner = payable(msg.sender);
       balance = initBalance;
       amountOfTransactions=0;
   }

   function getBalance() public view returns(uint256){
       return balance;
   }

   function deposit(uint256 _amount) public payable {
       require(msg.sender == owner, "You are not the owner of this account");
       require(msg.value == _amount, "Incorrect deposit amount");
       balance += _amount;
       amountOfTransactions++;
       emit Deposit(_amount);
   }

   error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

   function withdraw(uint256 _withdrawAmount) public {
       require(msg.sender == owner, "You are not the owner of this account");
       require(balance >= _withdrawAmount, "Insufficient balance");
       balance -= _withdrawAmount;
       amountOfTransactions++;
       emit Withdraw(_withdrawAmount);
   }

   function getAmountOfTransactions() public view returns(uint256){
       return amountOfTransactions;
   }
}
