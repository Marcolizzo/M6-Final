const express = require("express");
const books = express.Router();
const BooksModel = require("../models/books")
const verified = require('../middelwares/verifyToken');
const UserModel = require('../models/users');
const multer = require("multer");
const { cloudStorage } = require('../config/cloudinaryConfig');
const { internalStorage } = require('../config/internalStorageConfig');
require("dotenv").config()

const upload = multer({ storage: internalStorage })
const cloudUpload = multer({ storage: cloudStorage })

// upload files su cloudinary
books.post(`/books/cloudUploadImg`,
    cloudUpload.single(`uploadImg`), async (req, res) => {
        try {
            res.status(200).json({ source: req.file.path })
        } catch (e) {
            res.status(500).send({
                statusCode: 500,
                message: "File Upload Error",
            })
        }
    }
)

// upload files nell'archivio interno
books.post(`/books/uploadImg`,
    upload.single("uploadImg"), async (req, res) => {
        const url = req.protocol + "://" + req.get("host")
        try {
            const imageUrl = req.file.filename;
            res.status(200).json({ source: `${url}/uploads/${imageUrl}` });
        } catch (e) {
            res.status(500).send({
                statusCode: 500,
                message: "File Upload Error",
            })
        }
    })

books.get("/books", verified, async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    try {
        const books = await BooksModel.find()
            .populate('author')         /*Popolare l'autore del libro (Referencing)*/
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ pubDate: -1 });

        const totalBooks = await BooksModel.countDocuments();

        res.status(200).send({
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalBooks / pageSize),
            books,
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        });
    }
});

books.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await BooksModel.findById(id);

        if (!book) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested book does not exist!'
                })
        }
        res.status(200)
            .send(book)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

books.post(`/books/create`, async (req, res) => {
    const user = await UserModel.findOne({ _id: req.body.author })
    const newBook = new BooksModel({
        author: user._id,
        title: req.body.title,
        editor: req.body.editor,
        cover: req.body.cover,
        price: Number(req.body.price),
        description: req.body.description,
        isFeatured: req.body.isFeatured,
        pubDate: new Date(req.body.pubDate)
    })

    try {
        await newBook.save()
        res.status(201).send({
            statusCode: 201,
            payload: "Book saved successfully",
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        });
    }
});

books.patch("/books/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BooksModel.findById(id);
        if (!book) {
            return res.status(404).send({
                statusCode: 404,
                message: `Book with id ${id} not found!`,
            });
        }

        const bookToUpdate = req.body;
        const options = { new: true };
        const result = await BooksModel.findByIdAndUpdate(id, bookToUpdate, options)

        res.status(200).send(result);
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        })
    }
})

books.delete("/books/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BooksModel.findByIdAndDelete(id)
        if (!book) {
            return res.status(404).send({
                statusCode: 404,
                message: "The requested book not exist!",
            })
        }

        res.status(200).send(`Book with id ${id} successfully removed`)
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        })
    }
})

module.exports = books;