const path = require('path');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

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

app.get('/api/persons', (request, response) => {
    response.json(persons);
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const personExists = persons.some(p => p.id === id);

    if (personExists) {
        persons = persons.filter(p => p.id !== id);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const nameExists = persons.some(p => p.name === body.name)

    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person);
    response.status(201).json(person);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})