import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import AxiosClient from "../../client/client";
const client = new AxiosClient()

const initialState = {
    books: [],
    isLoading: false,
    error: null,
    totalBooks: 0
}

export const getAllBooks = createAsyncThunk(
    'books/GETBOOKS',
    async () => {
        return await client.get('/books')
    }
)

const booksSlice = createSlice({
    name: 'books',
    initialState,
    extraReducers: builder => {
        builder
            .addCase(getAllBooks.pending, state =>  {
                state.isLoading = true
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.isLoading = false
                state.totalBooks = action.payload.length
                state.books = action.payload
            })
            .addCase(getAllBooks.rejected, state => {
                state.isLoading = false
                state.error = 'Oops, an error has occurred. BAD DEV!'
            })
    }
})

export const allBooks = (state) => state.booksData.books
export const isBooksLoading = state => state.booksData.isLoading
export const booksError = state => state.booksData.error
export default booksSlice.reducer
