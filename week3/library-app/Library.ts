const ethers = require("ethers");
const Library = require('./Library.json')
const prompt = require("prompt-sync")({sigint:true});
const libFuncs = require("./lib-funcs.ts");

// This script interacts with local node

const run = async function() {
/*
    Task is:

    Creates a book
    Checks all available books
    Rents a book
    Checks that it is rented
    Returns the book
    Checks the availability of the book
*/
    while(1) {
        console.log("Enter 1 to addBooks");
        console.log("Enter 2 to logAvailableBooks");
        console.log("Enter 3 to borrowBook");
        console.log("Enter 4 to returnBook");
        console.log("Enter 5 to logBookDetails");
        console.log("Enter 6 to logBookCopies");

        const input = prompt();
        console.log("");

        if(!(Number(input) >= 1 && Number(input) <= 6))
            break;


        switch(input) {
            default:
                break;
            case '1':
                await libFuncs.addBooks("HarryPotter", 1);
                break;
            case '2':
                await libFuncs.logAvailableBooks();
                break;
            case '3':
                await libFuncs.borrowBook("HarryPotter");
                break;                   
            case '4':
                await libFuncs.returnBook("HarryPotter");
                break;
            case '5':
                await libFuncs.logBookDetails("HarryPotter");
                break;
            case '6':
                await libFuncs.logBookCopies("HarryPotter");
                break;
        }

        console.log("\nPress enter to continue..");
        prompt();
    }
}

run()
