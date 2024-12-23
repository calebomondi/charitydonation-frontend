// BookDetails.tsx
import React from "react";
import { useGetBook } from "../../hooks/useBookStore";

interface BookDetailsProps {
  bookId: number;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookId }) => {
  const { book, isError, isLoading } = useGetBook(bookId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading book details.</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Price: {book.price} Wei</p>
      <p>Stock: {book.stock}</p>
      <p>Status: {book.isAvailable ? "Available" : "Unavailable"}</p>
    </div>
  );
};

export default BookDetails;
