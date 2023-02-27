import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSigner, useAccount } from 'wagmi';
import walletABI from '../abi/Wallet.json';
import libABI from '../abi/Library.json';
import Button from '../components/ui/Button';
import { Box } from './Box'
import "../style/styles.css"

const Wallet = () => {
  const { data: signer } = useSigner();

  const [contractLib, setContractLib] = useState();
  const [err, setErr] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [books, setBooks] = useState([]);

  const handleAmountChange = e => {
    const { value } = e.target;
    setData(value);
  };

  useEffect(() => {
    if (signer) {
      const _contractLib = new ethers.Contract(
        '0x9aaA0f94F566358C0eE478aE16Ea63f1156DD3B6',
        libABI,
        signer,
      );

      setContractLib(_contractLib);
    }
  }, [signer]);

  useEffect(() => {
    if (contractLib)
      getBooks();
  }, [contractLib,]);

  const getBooks = async () => {
    const arr = [];
    try {
      const numberOfBooks = await  contractLib.getNumberOfBooks();
      for (let i = 0; i < numberOfBooks; i++) {
        const key = await contractLib.iterator(i);

        const book = await contractLib.books(key);
        arr.push(book);
      }
      setBooks(arr);
    } catch (e) {
        console.log(e);
    } 
  }

  const handleAddBookClick = async () => {
    setIsLoading(true);
    setErr(false);
    let err = false;
    
    try {
      const tx = await contractLib.addBook(data, 1);
      await tx.wait();
    } 
    catch (e) {
      err = true;
      setErr(e.reason);
    } 
    finally {
      setIsLoading(false);
      if(!err) {
        getBooks();
      }
    }
  };
  
  const handleBorrowBookClick = async () => {
    setIsLoading(true);
    setErr(false);

    try {
      const tx = await contractLib.borrowBook(data);
      await tx.wait();
    } 
    catch (e) {
      setErr(e.reason);
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleReturnBookClick = async () => {
    setIsLoading(true);
    setErr(false);

    try {
      const tx = await contractLib.returnBook(data);
      await tx.wait();
    } 
    catch (e) {
      setErr(e.reason);
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5 my-lg-10">
      <h1 className="heading-medium mb-5">Library interaction</h1>

      <input
        type="text"
        className="form-control"
        onChange={handleAmountChange}
      />

      <div className="d-flex align-items-center">
        <Box
          textBox={true}
          loading={isLoading}
          onClick={handleAddBookClick}
          title={"AddBook"}
        />

        <Box
          textBox={true}
          loading={isLoading}
          onClick={handleBorrowBookClick}
          title={"BorrowBook"}
        />

        <Box  
          textBox={true}
          loading={isLoading}
          onClick={handleReturnBookClick}
          title={"ReturnBook"}
        />
      </div>

      {err && <div> {err} </div>}

      {books && books.map((element, index) => 
        (
          <div key={index}>
            {element[0] +" "+ element[1]}
          </div>
        )
      )}

    </div>
  );
};

export default Wallet;
