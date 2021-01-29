const express = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const router = new express.Router() 

router.post('/books', auth, async(req, res) => {
    const book = new Book({
        ...req.body,
        owner: req.user._id
    })

    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /books?
//GET /books?limit=10&skip=20
//GET /book?sortBy=createdAt:des
router.get('/books', auth, async(req, res) => {
    const sort = {}
    
    if (req.query.sortBy) {
        const str = req.query.sortBy.split(":")
        sort[str[0]] = str[1] === "des" ? -1 : 1   
    }
    
    try {     
        await req.user.populate({
            path: 'books',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            } 
        }).execPopulate() 
        res.send(req.user.books)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/books/:id', auth, async(req, res)=> {
    const _id = req.params.id

    try  { 
        const book = await Book.findOne({_id: _id, owner: req.user._id})
        if(!book){
            return res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(500).send() 
    }  
})

router.patch('/books/:id', auth, async(req, res) => {
    const validUpdates = ["title", "author"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) =>  validUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid update!"})
    }

    try {
        const book = await Book.findOne({_id: req.params.id, owner: req.user._id})
        
        if (!book) {
            return res.status(404).send()
        }
         
        updates.forEach((update) => book[update] = req.body[update])        
        await book.save()
        res.send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/books/:id',auth, async(req, res) => {
    try {
        const book = await book.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!book) {
            res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router