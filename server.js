const express = require('express')
const app = express()
let notes = require('./db/db.json')
const {uid} = require('uid')


const path = require('path')
const { fstat } = require('fs')
const { isBuffer } = require('util')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.listen(process.env.PORT ||3000)

app.get('/', (req, res) =>{
    res.sendFile(path.join( __dirname, 'public', 'index.html'))
})
//links to index.html
app.get('/notes', (req, res) =>{
    res.sendFile(path.join( __dirname, 'public', 'notes.html'))
})
//links to notes.html

app.get('/api/notes', (req, res)=>{
    res.json(notes)
})

app.post('/api/notes', (req, res) =>{
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uid() //gives unique id to each notes so that we can delete
    }
    notes.push(newNote)
    fs.writefile(path.join(__dirname, 'db','db.json'),JSON.stringify(notes), err =>{
        if (err) {console.log(err)} //new note to db.json file
        res.json(newNote)
    })
    res.json(200)
})

app.delete('/api/notes/:id', (req, res)=>{
    notes=notes.filter(note =>note.id != req.params.id)
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), err =>{
        if (err){console.log(err)} //delete note from json
    })
    res.json(notes)
})
