import { useReadContract } from 'wagmi'

import bookStoreABI from '../abi/BookStore.json'

const CONTRACT_ADDRESS = '0x6589252bf0565D8C34a6E378606B8Af5f40927d8'


type Book = {
    title: string;
    author: string;
    price: number;
    stock: number;
    isAvailable: boolean;
};

export function useGetBook(bookId: number) {
    const { data, isError, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: bookStoreABI.abi,
      functionName: "getBooks",
      args: [bookId],
    });

    // Explicitly type the returned data
    const typedData = data as [string, string, number, number, boolean] | undefined;
    
    const book: Book | null = typedData
    ? {
        title: typedData[0],
        author: typedData[1],
        price: Number(typedData[2]),
        stock: Number(typedData[3]),
        isAvailable: typedData[4],
      }
    : null;
  
    return { book, isError, isLoading };
  }