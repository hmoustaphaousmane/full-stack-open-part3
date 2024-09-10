const express = require('express')
const morgan = require('morgan')

const app = express()

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  response.json(persons.filter(persons => persons.id === id))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // console.log(request.body)

  const id = String(Math.floor(Math.random() * 500))
  const name = request.body.name
  const number = request.body.number

  const names = persons.map(person => person.name.toLowerCase())

  if (!name || !number)
    return response.status(400).json({ error: 'name or number missing' })

  if (names.includes(name.toLowerCase()))
    return response.status(400).json({ error: 'name must be unique' })

  const person = {
    id: id,
    name: name,
    number: number
  }
  // console.log(person)

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
