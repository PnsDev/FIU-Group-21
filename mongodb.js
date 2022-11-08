const { Console } = require('console')
const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.use(express.json())
var database

app.get('/', (req, resp) => {
    resp.send("Welcome to MongoDB API")
})

app.get('/api/books', (req, resp) => {
    database.collection('books').find({}).toArray((err, result) => {
        if (err) throw err
        resp.send(result)
    })
})

app.get('/api/books:id', (req, resp) => {
    database.collection('books').find({}).toArray((err, result) => {
        if (err) throw err
        resp.send(result)
    })
})

app.post('/api/books/addBook', (req, resp) => {
    let res = database.collection('books').find({}).sort({id: -1}).limit(1)
    res.forEach (obj => {
        if (obj) {
            let book = {
                id: obj.id + 1,
                title: req.body.title
            }
            database.collection('books').insertOne(book, (err, result) => {
                if (err) resp.status(500).send(err)
                resp.send("Added Successfully")
            })
        }
    })
})

app.put('/api/books/:id', (req, resp) => {
    let query = {id: parseInt(req.params.id)}
    let book = {
        id: parseInt(req.params.id),
        title: req.body.title
    }
    let dataSet = {
        $set: book
    }
    database.collection('books').updateOne({id: parseInt(req.params.id)}, {$set: book}, (err, result) => {
        if (err) throw err
        resp.send(book)
    })
})

app.listen(8080, () => {
    // CHANGE TO CONNECTION STRING
    MongoClient.connect('mongodb://localhost:2707', { useNewUrlParser: true}, (error, result) => {
        if (error) throw error
        // CHANGE TO DATABASE NAME OF MONGODB
        database = result.db('mydatabase')
        console.log('Connection successful')
    } );
})
