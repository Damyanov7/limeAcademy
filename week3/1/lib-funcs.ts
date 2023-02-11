async function getLibContract() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your election contract address

    const balance = await wallet.getBalance();
    console.log("Current balance: " + ethers.utils.formatEther(balance, 18));

    return new ethers.Contract(contractAddress, Library.abi, wallet);
}

async function addBooks(book) {
    const LibraryContract = await getLibContract();
    await LibraryContract.addBooks(book);
}

async function logAvailableBooks() {
    const LibraryContract = await getLibContract();
    let titles = await LibraryContract.getNumberOfBooks();
    console.log("Titles" + titles);

    for (let i = 0; i < titles; i++) {
        let currTitle = await LibraryContract.books(LibraryContract.iterator(i));
        if (currTitle[0]) {
            console.log("Title: " + currTitle[2] + ", Copies: " + currTitle[1]);
        }
    }
}

async function borrowBook(book) {
    const LibraryContract = await getLibContract();

    if (await LibraryContract.isRented(book)) {
        console.log("Book is already borrowed");
    } else {
        await LibraryContract.borrowBook(book);
    }
}

async function returnBook(book) {
    const LibraryContract = await getLibContract();

    if (await LibraryContract.isRented(book)) {
        await LibraryContract.returnBook(book);
    } else {
        console.log("Invalid return book")
    }
}

async function logBookDetails(book) {
    const LibraryContract = await getLibContract();
    let details = await LibraryContract.getBookDetails(book);
    console.log(details)
}

async function logBookCopies(book) {
    const LibraryContract = await getLibContract();
    let copies = (await LibraryContract.getBookDetails(book))[1];
    console.log("Available copies are: " + copies);
}