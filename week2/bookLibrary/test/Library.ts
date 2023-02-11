import { Library } from "./../typechain-types/contracts/Library";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Library", function () {
    let LibraryFactory;
    let Library: Library;
    let owner, addr1;

    before(async () => {
        [owner, addr1] = await ethers.getSigners();
        LibraryFactory = await ethers.getContractFactory("Library");
        Library = await LibraryFactory.deploy();
        await Library.deployed();
    });


    it("Should fail to add book", async function () {
        expect(Library.connect(addr1).addBooks("RandomTitle")).to.be.revertedWith('Ownable: caller is not the owner');
    });

    for(let i = 1; i < 3; i++) 
        it("Should add book (RandomTitle) " + i, async function () {
            await Library.addBooks("RandomTitle");
            expect(await Library.getNumberOfBooks()).to.equal(1);
            expect(await Library.books(Library.iterator(0))).to.eql([true, i, "RandomTitle"]);
        });

    it("Should add new unique book", async function () {
        await Library.addBooks("RandomTitle2");
        expect(await Library.getNumberOfBooks()).to.equal(2);
        expect(await Library.getBookDetails("RandomTitle2")).to.eql(["RandomTitle2", 1]);
    });

    it("Should borrow a book", async function () {
        expect(Library.borrowBook("RandomTitle")).to.ok;
        expect(await Library.isRented("RandomTitle")).to.equal(true);
    });

    it("Should revert with book does not exist", async function () {
        expect(Library.borrowBook("123")).to.be.revertedWith('Book does not exist');
    });

    // Functionality of currentBorrowers is covered in this test case
    it("Should fail to borrow book", async function () {
        expect(Library.borrowBook("RandomTitle")).to.be.revertedWith("The sender has already borrowed this book");
    });

    it("Should revert with no available copies", async function () {
        await Library.connect(addr1).borrowBook("RandomTitle");
        expect(Library.connect(addr1).borrowBook("RandomTitle")).to.be.revertedWith("No copies");
    });

    it("Should revert with this book was never borrowed", async function () {
        expect(Library.returnBook("1234")).to.be.revertedWith('This book does not belong to the lib');
    });

    it("Should return borrowed book by owner", async function () {
        await Library.returnBook("RandomTitle");
    });

    it("Should revert with user hasn't borrowed this book", async function () {
        expect(Library.returnBook("RandomTitle")).to.be.revertedWith("User hasn't borrow this book");
    });

    it("Should revert with no such title", async function() {
        expect(Library.getBorrowingHistory("RandomTitle123")).to.be.revertedWith("No such title");
        expect(Library.isRented("RandomTitle123")).to.be.revertedWith("No such title");
        expect(Library.getBookDetails("RandomTitle123")).to.be.revertedWith("No such title");
    });

    // Checking if the addresses that were used when borrowing books are present in the borrowings history
    it("Should get borrowing history", async function() {
        const a = await Library.getBorrowingHistory("RandomTitle");
        expect(a).to.eql([await owner.getAddress(), await addr1.getAddress()]);
    });
});
