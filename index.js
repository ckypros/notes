const express = require('express');
const app = express();

// Use express JSON parser
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Morgan: HTTP request logger middleware
const morgan = require('morgan');
morgan.token('body', function (request) {
    return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :response-time :req[header] :body'));

app.use(express.static('build'));

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

// Get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

// Get info page
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
});

// Get person by Id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    // Find person with matching id
    const person = persons.find((p) => {
        return p.id === id;
    });
    // Show person if found, or 404 error if not
    person ? response.json(person) : response.status(404).end();
});

// Delete a person by Id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    console.log(`Deleting person with id: ${id}`);
    response.status(204).end();
});

// Define port for the app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add a person entry
app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        let missing = [];
        if (!request.body.name) missing.push('Name');
        if (!request.body.number) missing.push('Number');
        console.log(`Adding Person: ERROR: missing fields: ${missing}`);
        return response.status(400).send(`ERROR: missing fields: ${missing}`);
    }

    if (persons.find((person) => person.name === request.body.name)) {
        console.log(
            `Adding Note: ERROR: person with name "${request.body.name}" already exists in phonebook`
        );
        return response
            .status(400)
            .send(
                `ERROR: person with name "${request.body.name}" already exists in phonebook`
            );
    }

    const person = {
        name: request.body.name,
        number: request.body.number,
        date: new Date(),
        id: generateId(),
    };

    persons = persons.concat(person);
    console.log('Adding Person: ', person);
    response.json(person);
});

// Generate id for new person
const generateId = () => {
    return persons.length + 1;
};
