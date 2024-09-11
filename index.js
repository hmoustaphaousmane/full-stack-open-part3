require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('dist'))

app.use(express.json())

// const morganLogger = morgan('tiny')
morgan.token('req-body', (req, res) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :res[content-length] :response-time ms :req-body'
))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(savedPerson => {
    console.log('successfully saved', savedPerson.name, 'to the phonebook')
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
