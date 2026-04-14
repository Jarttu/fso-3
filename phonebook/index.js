require('dotenv').config()
const path = require('path');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const Person = require('./models/person')

const app = express();

app.use(cors());
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')));

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423123"
    }
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    const personsCount = persons.length;
    const date = new Date();

    response.send(`
        <p>Phonebook has info for ${personsCount} people</p>
        <p>${date}</p>
    `)
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const person = new Person({
        name,
        number
    });

    person.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson);
        })
        .catch(error => next(error));
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})