// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Library is Ownable {

    struct Book {
        uint32 availableCopies;
        string title; 
        address[] borrowingHistory;
        mapping(address => bool) currentBorrowers; 
    }

    mapping(bytes32 => Book) public books; 
    bytes32[] public iterator;

    event BookAdded(bytes32 key, string title, uint copies);
    event BookBorrowed(bytes32 key, string title, address borrower);
    event BookReturned(bytes32 key, string title, address borrower);

    modifier checkTitle(string memory _title) {
        bytes32 key = keccak256(abi.encodePacked(_title));
        require(keccak256(abi.encodePacked(books[key].title)) != keccak256(abi.encodePacked("")), "Library doesn't contain the specified book");
        _;
    }

    function addBook(string memory _title, uint32 _amount) public onlyOwner {
        bytes32 key = keccak256(abi.encodePacked(_title));

        if (keccak256(abi.encodePacked(books[key].title)) == keccak256(abi.encodePacked(""))) {
            books[key].title = _title;
            books[key].availableCopies += _amount;    
            iterator.push(key);
        } else {
            books[key].availableCopies++;
        }

        emit BookAdded(key, _title, books[key].availableCopies);

        return;
    }

    function borrowBook(string memory _title) public checkTitle(_title) {
        bytes32 key = keccak256(abi.encodePacked(_title));
        require(books[key].availableCopies > 0, "There are no copies available from this book");
        require(!books[key].currentBorrowers[msg.sender], "The user has already borrowed this book");

        books[key].availableCopies--;
        books[key].currentBorrowers[msg.sender] = true;
        books[key].borrowingHistory.push(msg.sender);

        emit BookBorrowed(key, _title, msg.sender);

        return;
    }

    function returnBook(string memory _title) public checkTitle(_title) {
        bytes32 key = keccak256(abi.encodePacked(_title));
        require(books[key].currentBorrowers[msg.sender], "User has not borrowed such a book");

        books[key].availableCopies++;
        books[key].currentBorrowers[msg.sender] = false;

        emit BookReturned(key, _title, msg.sender);
    }

    function getBorrowingHistory(string memory _title) public view checkTitle(_title) returns(address[] memory) {
        bytes32 key = keccak256(abi.encodePacked(_title));
        return books[key].borrowingHistory;
    }

    function isRented(string memory _title) public view checkTitle(_title) returns (bool){
        bytes32 key = keccak256(abi.encodePacked(_title));
        return books[key].currentBorrowers[msg.sender];
    }

    function getBookDetails(string memory _title) public view checkTitle(_title) returns (string memory, uint32) {
        bytes32 key = keccak256(abi.encodePacked(_title));
        return (books[key].title, books[key].availableCopies);
    }

    function getNumberOfBooks() public view returns(uint) {
        return iterator.length;
    }
}