const express = require('express');
const router = express.Router();
const AuthorsModel = require('../models/authors');


router.get('/authors', async (req, res) => {
    try {
        const authors = await AuthorsModel.find();
        res
            .status(200)
            .send(authors)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.get('/authors/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const author = await AuthorsModel.findById(id);

        if (!author) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author does not exist!'
                })
        }
        res.status(200)
            .send(author)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})


router.post('/authors', async (req, res) => {
    const newAuthor = new AuthorsModel(req.body);

    try {
        const authorToSave = await newAuthor.save();
        res
            .status(201)
            .send({
                statusCode: 201,
                payload: authorToSave
            })
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.patch('/authors/:id', async (req, res) => {
    const { id } = req.params

    try {
        const author = await AuthorsModel.findById(id);
        if (!author) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author not exist!'
                })
        }

        const updatedData = req.body;
        const options = { new: true };

        const result = await AuthorsModel.findByIdAndUpdate(id, updatedData, options);

        res
            .status(200)
            .send(result)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.delete('/authors/:id', async (req, res) => {
    const { id } = req.params
    try {
        const author = await AuthorsModel.findByIdAndDelete(id);
        if (!author) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author not exist!'
                })
        }

        res
            .status(200)
            .send(`User with id ${id} successfully removed`)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

module.exports = router;