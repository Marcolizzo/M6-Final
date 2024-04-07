import React, { useEffect, useState } from 'react'
import LoadingIndicator from '../loadingIndicator/LoadingIndicator'
import ErrorAlert from '../alerts/ErrorAlert'
import BookCard from '../card/BookCard'
import useSession from '../../hooks/useSession'
import AddBookModal from '../addBookModal/AddBookModal'

const MainContent = () => {
    const session = JSON.parse(localStorage.getItem('auth'))
    const isAuthenticated = useSession()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [books, setBooks] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const onChangePageSize = (e) => {
        setPageSize(+e.target.value)
    }

    const next = () => {
        setPage((prev) => prev + 1)
    }

    const prev = () => {
        setPage((prev) => prev - 1)
    }

    const getBooks = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:3030/books?page=${page}&pageSize=${pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        authorization: session,
                    },
                }
            )
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
    }, [page, pageSize])

    return (
        <div className="container pt-5 pb-5">
            <div className="row">
                <div className='col pb-2'>
                    <select onChange={onChangePageSize}>
                        <option value={4}>Quattro</option>
                        <option value={7}>Sette</option>
                        <option value={10}>Dieci</option>
                    </select>
                </div>
            </div>
            <div className="row">
                {isLoading && <LoadingIndicator />}
                {!isLoading && error && (
                    <ErrorAlert message="Oops! Qualcosa è andato storto durante il caricamento dei dati" />
                )}
                {isAuthenticated &&
                    !isLoading &&
                    !error &&
                    books.books &&
                    books.books.map((book) => (
                        <div
                            key={book._id}
                            className="col-12 col-md-6 col-lg-4 col-xl-3 mb-3"
                        >
                            <BookCard
                                title={book.title}
                                description={book.description}
                                cover={book.cover}
                                author={book.author.firstName || 'not found'}
                                editor={book.editor}
                                isFeatured={book.isFeatured}
                                pubDate={book.pubDate}
                                price={book.price.$numberDecimal}
                            />
                        </div>
                    ))}
            </div>
            <div className="d-flex justify-content-between">
                <button onClick={prev} className="btn btn-primary">
                    Precedente
                </button>
                <button onClick={next} className="btn btn-primary">
                    Successivo
                </button>
            </div>
        </div>
    )
}

export default MainContent
