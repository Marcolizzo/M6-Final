import React, {useEffect, useState} from 'react';
import LoadingIndicator from "../loadingIndicator/LoadingIndicator";
import ErrorAlert from "../alerts/ErrorAlert";
import BookCard from "../card/BookCard";
import useSession from "../../hooks/useSession";
import AddBookModal from "../addBookModal/AddBookModal";

const MainContent = () => {
    const session = JSON.parse(localStorage.getItem('auth'))
    const isAuthenticated = useSession();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [books, setBooks] = useState([])

    const getBooks = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:3030/books', {
                method: 'GET',
                headers: {
                    "Content-type": 'application/json',
                    "authorization": session
                }
            })
            const data = await response.json()
            setBooks(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
            getBooks()
    }, [])

    return (
        <div className="container pt-5 pb-5">
            <div className="row">
                {isLoading && <LoadingIndicator />}
                {!isLoading && error && (
                    <ErrorAlert
                        message="Oops! Qualcosa è andato storto durante il caricamento dei dati"
                    />
                )}
                {isAuthenticated && !isLoading && !error && (
                    books.books && books.books.map((book) => (
                        <div key={book._id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                            <BookCard
                                title={book.title}
                                description={book.description}
                                cover={book.cover}
                                author={book.author}
                                editor={book.editor}
                                isFeatured={book.isFeatured}
                                pubDate={book.pubDate}
                                price={book.price.$numberDecimal}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MainContent;
