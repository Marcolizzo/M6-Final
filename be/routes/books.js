const express = require("express");
const books = express.Router();
const BooksModel = require("../models/books")
const verified = require('../middelwares/verifyToken');
const multer = require("multer");

//filesystem interno per archivio immagini interno
const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() + 1E9);
        const fileExtension = file.originalname.split(".").pop()
        // cb(null, `${file.fieldname}-${new Date().toISOString()}.${fileExtension}`)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

const upload = multer({ storage: internalStorage })
// const cloudUpload = multer({ storage: cloudStorage })

books.post(`/books/uploadImg`, upload.single("uploadImg"), async (req, res) => {
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
    const { page = 1, pageSize = 24 } = req.query;
    try {
        const books = await BooksModel.find()
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
    const newBook = new BooksModel(req.body)

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